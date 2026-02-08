// use a json to easily change or extend the rules without modifying the code
import rules from "./rules.json" with { type: "json" };

type Rule = {
  divider: number;
  labelToDisplay: string;
};

function getLabelForNumber(n: number, rules: Rule[]): string | null {
  const result = rules.reduce((acc: string, rule) => {
    if (n % rule.divider === 0) {
      return acc + rule.labelToDisplay;
    }
    return acc;
  }, "");

  return result.length > 0 ? result : null;
}

// use a generator for memory efficiency, and granular control over the output
function* fizzBuzzGenerator(max: number, rules: Rule[]): Generator<string> {
  for (let i = 1; i <= max; i++) {
    const result = getLabelForNumber(i, rules);
    yield result ?? i.toString();
  }
}

function main(): void {
  const arg = process.argv[2];

  if (arg === undefined) {
    console.error("Usage: pnpm algo <N>");
    process.exit(1);
  }

  const n = Number(arg);

  if (!Number.isInteger(n) || n <= 0) {
    console.error("Error: N must be a positive integer");
    process.exit(1);
  }

  for (const line of fizzBuzzGenerator(n, rules)) {
    console.log(line);
  }
}

main();
