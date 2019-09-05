// This file defines a directory_test() function that can be used to define
// tests that require a FileSystemDirectoryHandle. The implementation of that
// function in this file will ask the user to select an empty directory and
// uses that directory.
//
// Another implementation of this function exists in sandboxed-fs-test-helpers.js,
// where that version uses the sandboxed file system instead.

const directory_promise = (async() => {
  await new Promise(resolve => {
    window.addEventListener('DOMContentLoaded', resolve);
  });
  const button = document.createElement('button');
  button.append("Click here");
  const p = document.createElement('p');
  p.append("Please select an empty directory after clicking the following button: ", button);
  document.body.append(p);

  await new Promise(resolve => {
    button.onclick = resolve;
  });
  document.body.removeChild(p);
  const entries = await self.chooseFileSystemEntries({type: 'openDirectory'});
  assert_true(entries instanceof FileSystemHandle);
  assert_true(entries instanceof FileSystemDirectoryHandle);
  for await (const entry of entries.getEntries()) {
      assert_unreached('Selected directory is not empty');
  }
  return entries;
})();

function directory_test(func, description) {
    promise_test(async t => {
        const directory = await directory_promise;
        await func(t, directory);
    }, description);
}

directory_test(async (t, dir) => {
  assert_equals(await dir.queryPermission({writable: false}), 'granted');
}, 'User succesfully selected an empty directory.');

directory_test(async (t, dir) => {
  const status = await dir.queryPermission({writable: true});
  if (status == 'granted')
    return;

  const button = document.createElement('button');
  button.append("Click here");
  const p = document.createElement('p');
  p.append("Please grant write access to the directory after clicking the following button: ", button);
  document.body.append(p);
  await new Promise((resolve, reject) => {
    button.onclick = resolve;
  });
  document.body.removeChild(p);
  assert_equals(await dir.requestPermission({writable: true}), 'granted');
}, 'User granted write access.');

