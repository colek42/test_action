# Hello World GitHub Action

This action prints "Hello" + the name of a person to greet to the log output and returns the current time.

## Inputs

### `who-to-greet`

**Required** The name of the person to greet. Default: `"World"`.

## Outputs

### `time`

The time we greeted you.

## Example usage

```yaml
uses: colek42/test_action@v1
with:
  who-to-greet: 'Mona the Octocat'
```