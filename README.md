# Debug Info GitHub Action

This action outputs extensive debug information and handles various YAML input types.

## Features

- Accepts and processes all YAML value types (string, number, boolean, array, object)
- Prints the working directory path
- Prints the system PATH
- Lists working directory contents (`ls -al`)
- Shows git repository information
- Outputs to stdout
- Writes all information to a file
- Provides detailed GitHub context information

## Inputs

### `string-input`
**Required** A string input. Default: `"Default string"`.

### `number-input`
A number input. Default: `42`.

### `boolean-input`
A boolean input. Default: `true`.

### `array-input`
A YAML array input (comma-separated). Default: `"item1,item2,item3"`.

### `object-input`
A YAML object input (JSON string). Default: `{"key1":"value1","key2":"value2"}`.

### `output-file-path`
Path where the output file should be written. Default: `"debug-output.txt"`.

## Outputs

### `working-directory`
The working directory path.

### `file-list`
List of files in the working directory.

### `git-info`
Git repository information.

### `all-debug-info`
All debug information combined as JSON.

## Example usage

```yaml
name: Debug Info Workflow

on: [push]

jobs:
  debug-job:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Debug Info Action
        uses: colek42/test_action@v1
        with:
          string-input: 'Hello from workflow'
          number-input: 123
          boolean-input: true
          array-input: 'first,second,third'
          object-input: '{"name":"Test","enabled":true}'
          output-file-path: 'debug-data.json'

      - name: Upload debug file
        uses: actions/upload-artifact@v4
        with:
          name: debug-data
          path: debug-data.json
```