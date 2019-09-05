// This file defines a directory_test() function that can be used to define
// tests that require a FileSystemDirectoryHandle. The implementation of that
// function in this file will return an empty directory in the sandboxed file
// system.
//
// Another implementation of this function exists in native-fs-test-helpers.js,
// where that version uses the native file system instead.

async function cleanupSandboxedFileSystem() {
    const dir = await FileSystemDirectoryHandle.getSystemDirectory({ type: 'sandbox' });
    for await (let entry of dir.getEntries())
        dir.removeEntry(entry.name, { recursive: entry.isDirectory });
}

promise_test(async t => cleanupSandboxedFileSystem(),
  'Cleanup to setup test environment');

function directory_test(func, description) {
    promise_test(async t => {
        const dir = await FileSystemDirectoryHandle.getSystemDirectory({ type: 'sandbox' });
        await func(t, dir);
    }, description);
}
