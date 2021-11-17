import { exit, argv } from 'process'
import { bgRed, bgWhite, red, green, black, yellow, cyan, magenta, zebra } from 'colors'
//const align = require('text-align')
const { Confirm, Form } = require('enquirer')
const { log } = console

function displayHelp(e: boolean|void): void {
  log()
  if (typeof e !== 'undefined' && e) exit(0)
}
if (argv.includes('-h') || argv.includes('--help')) displayHelp(true)

if (argv.length > 2) {
  for (let i = 2; i < argv.length; i++) {
    let n: number, r: boolean = true
    switch (argv[i]) {
      case '-n': {
        if (!isNaN(Number(argv[i + 1]))) n = Number(argv[i + 1])
        else log("Not a valid number. Skipping")
        break
      }
      case ('-r'||'--no-replay'): {
        r = false
        break
      }
    }
    if (n) log()
    if (!r) log()
    main(n, r)
  }
}
else main()

async function Exit(silent: boolean = false): Promise<Function> {
  return await new Promise(r => {
    if (silent) exit(0)
    else {
      new Confirm({
        name: "q",
        message: red("Quit?")
      })
      .run()
      .then((answer: boolean) => {
        if (answer) exit(0)
        else r(main())
      })
      .catch(() => {})
    }
  })
}

function createArray(nMax: number): boolean[] {
  let arr: true[] = []
  for (let i: number = 2; i < nMax; i++) {
    arr.push(true)
  }
  return arr
}

function findNextPrime(n: boolean[], s: number): number | false {
  let i: number = n.length - 1
  for(let j: number = s; j < i; j++) {
    if (n[j + 1]) {
      return j + 1
    }
  }
  return false
}

function findPrimes(n: number): number[] {
  //log(n)
  let arr: boolean[] = createArray(n)
  let primes: number[] = []
  for (let step: number = 1; step < n;) {
    const nextStep = findNextPrime(arr, step)
    if (!nextStep) return primes
    else {
      primes.push(nextStep)
      step = nextStep
      //log(nextStep)
    }
    for (let i: number = 2; i < n; i++) {
      if(i % step === 0) arr[i] = false
    }
  }
}

async function main(n: number|void, r: boolean|void): Promise<Function> {
  return await new Promise(res => {
    if(typeof n !== "undefined") {
      log(...findPrimes(n || 10000))
      if (r) res(Exit(false))
      else res(Exit(true))
    }
    if (n) log(findPrimes(n))
    else new Form({
      name: "Get variables values",
      message: "Please provide the value for the following variables:",
      choices: [
        { name: 'n', message: 'n =', initial: String(Math.floor(Math.random() * 134))},
        { name: 'r', message: 'Replay?', initial: "true"}]
    })
    .run()
      .then((answer: {n: string, r: string}) => {
        log(...findPrimes(Number(answer.n)))
        if (Boolean(answer.r)) res(Exit(false))
        else res(Exit(true))
      })
      .catch(() => {})
  })
}
