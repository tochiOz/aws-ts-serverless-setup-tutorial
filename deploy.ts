import { Command } from 'commander';
const program = new Command();

program
  .version('0.1.0')
  .description('An example CLI for managing tasks')
  .option('-l, --list', 'List all tasks')
  .option('-a, --add <task>', 'Add a task');

program.parse(process.argv);
const options = program.opts();

if (options.list) {
  console.log('Listing all tasks...');
  // Add functionality to list tasks
}

if (options.add) {
  console.log(`Adding task: ${options.add}`);
  // Add functionality to add tasks
}
