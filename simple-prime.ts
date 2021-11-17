import { exit, argv } from 'process'
const { log } = console

if (argv.length > 2) {
  if (isNaN(Number(argv[2]))) {
    log("Not a valid number. Exiting...")
    exit(1)
  }
  else main(Number(argv[2]))
}
else {
  log("Didn't find any number to find. Exiting...")
  exit(1)
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
  let arr: boolean[] = Array(n).fill(true)
  let primes: number[] = []
  for (let step: number = 1; step < n;) {
    const nextStep = findNextPrime(arr, step)
    if (!nextStep) return primes
    else {
      primes.push(nextStep)
      step = nextStep
    }
    for (let i: number = 2; i < n; i++) {
      if(i % step === 0) arr[i] = false
    }
  }
}

async function main(n: number): Promise<Function> {
  return await new Promise(res => {
    if(typeof n !== "undefined") {
      log(...findPrimes(n))
      res(exit(0))
    }
  })
}