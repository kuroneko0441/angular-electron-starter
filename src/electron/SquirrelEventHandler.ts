import * as childProcess from 'child_process';
import { app } from 'electron';
import * as path from 'path';

export const isSquirrelEvent = (argument: string): boolean => {
    return argument === '--squirrel-install' ||
        argument === '--squirrel-updated' ||
        argument === '--squirrel-uninstall' ||
        argument === '--squirrel-obsolete';
};

export const squirrelEventHandler = (): boolean => {
    if (!isSquirrelEvent(process.argv[1])) {
        return false;
    }

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = (command: string, args: string[]): childProcess.ChildProcess => {
        return childProcess.spawn(command, args, { detached: true });
    };

    const spawnUpdate = (args: string[]): childProcess.ChildProcess => {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate([ '--createShortcut', exeName ]);
            app.quit();
            return true;
        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate([ '--removeShortcut', exeName ]);
            app.quit();
            return true;
        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated
            app.quit();
            return true;
        default:
            return false;
    }
};
