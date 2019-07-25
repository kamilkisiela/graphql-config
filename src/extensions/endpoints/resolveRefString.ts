export function resolveRefString(str: string, values?: object): string {
  const { strings, rawRefs } = parse(str)
  const refValues = rawRefs.map(ref => resolveRef(ref, values))

  let res = ''
  for (let i = 0; i < refValues.length; i++) {
    res += strings[i]
    res += refValues[i]
  }
  res += strings.pop()
  return res
}

export function resolveEnvsInValues<T extends Record<string, any>>(
  config: T,
  env: Record<string, string | undefined>,
): T {
  for (const key in config) {
    const value = config[key]
    // tslint:disable-next-line: strict-type-predicates
    if (typeof value === 'string') {
      config[key] = resolveRefString(value, { env }) as any
    } else {
      config[key] = resolveEnvsInValues(value, env)
    }
  }
  return config
}

export function getUsedEnvs(config: any): Record<string, string> {
  const result = {}

  const traverse = (val: any) => {
    if (typeof val === 'string') {
      const rawRefs = parse(val).rawRefs
      for (let ref of rawRefs) {
        result[parseRef(ref).ref] = resolveRef(ref, {}, false)
      }
    } else if (typeof val === 'object') {
      for (let key in val) {
        traverse(val[key])
      }
    }
  }
  traverse(config)
  return result
}

function parseRef(rawRef: string): { type: string; ref: string } {
  const [type, ref] = rawRef.split(/\s*:\s*/)
  return { type, ref }
}

function resolveRef(
  rawRef: string,
  values: any = {},
  throwIfUndef: boolean = true,
): string | null {
  const { type, ref } = parseRef(rawRef)

  if (type === 'env') {
    if (!ref) {
      throw new Error(`Reference value is not present for ${type}: ${rawRef}`)
    }

    const refValue = (values.env && values.env[ref]) || process.env[ref]
    if (!refValue) {
      if (throwIfUndef) {
        throw new Error(`Environment variable ${ref} is not set`)
      } else {
        return null
      }
    }
    return refValue
  } else {
    // support only 'env' for now
    throw new Error(
      'Undefined reference type ${refType}. Only "env" is supported',
    )
  }
}

function parse(str: string): { strings: string[]; rawRefs: string[] } {
  const regex = /\${([^}]*)}/g
  const strings: string[] = []
  const rawRefs: string[] = []

  let prevIdx = 0
  let match: RegExpExecArray | null
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
