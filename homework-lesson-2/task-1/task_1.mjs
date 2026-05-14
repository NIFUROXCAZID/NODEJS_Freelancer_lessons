import readline from 'readline'

// беремо параметри командного рядка
const argsString = process.argv.slice(2).join('&')
const params = new URLSearchParams(argsString)

// отримуємо пенсійний вік
const pensionAge = parseInt(params.get('--pension'))

// створюємо readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// питаємо користувача
rl.question('Скільки вам років? ', (answer) => {
  const userAge = parseInt(answer)

  if (userAge >= pensionAge) {
    console.log('Ви пенсіонер')
  } else {
    console.log('Ви ще не пенсіонер')
  }

  rl.close()
})

// node task_1.mjs --pension=65

// cd folderName На рівень нижче
// cd .. На рівень вищче