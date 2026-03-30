import { megaSeed } from "../config/mega-seed";

async function main() {
  try {
    await megaSeed();
    process.exit(0);
  } catch (err) {
    console.error("Mega-Induction Failed:", err);
    process.exit(1);
  }
}

main();
