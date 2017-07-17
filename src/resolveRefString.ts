export default function resolveReftring(str: string): string {
  const { strings, rawRefs } = parse(str)
  const refValues = rawRefs.map(resolveRef)

  let res = ''
  for (let i = 0; i < refValues.length; i++) {
    res += strings[i]
    res += refValues[i]
  }
  res += strings.pop()
  return res
}

function resolveRef(rawRef: string): string {
  const [refType, ref] = rawRef.split(/\s*:\s*/)

  if (refType === 'env') {
    if (!ref) {
      throw new Error('Reference value is not present for ${refType}: ${rawRef}')
    }

    const refValue = process.env[ref]
    if (!refValue) {
      throw new Error('Environment variable ${ref} is not set')
    }
    return refValue
  } else {
    // support only 'env' for now
    throw new Error('Undefined reference type ${refType}. Only "env" is supported')
  }
}

function parse(str: string): { strings: string[], rawRefs: string[] } {
  const regex = /\${([^}]*)}/g
  const strings: string[] = []
  const rawRefs: string[] = []

  let prevIdx = 0
  let match
  // tslint:disable-next-line:no-conditional-assignment
  while ((match = regex.exec(str)) !== null) {
    if (match.index > 0 && str[match.index - 1] === '\\') {
      continue
    }

    strings.push(str.substring(prevIdx, match.index))
    rawRefs.push(match[1])
    prevIdx = match.index + match[0].length
  }
  strings.push(str.substring(prevIdx))
  return { strings, rawRefs }
}
