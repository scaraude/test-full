# FizzBuzz

## Usage

```bash
pnpm algo <N>
```

where N is a positive integer (e.g. 15)

## Design

- **rules.json**: Externalized rules for easy extension without code changes
- **getLabelForNumber**: Uses `reduce` to concatenate matching labels (handles combined rules like FizzBuzz)
- **fizzBuzzGenerator**: Generator for memory efficiency with large N values, and granular control over the outpur
