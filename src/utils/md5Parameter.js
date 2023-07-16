import md5 from 'js-md5'

const salt = 'sdefergg581dfg@%&.G/DF.G'

export function md5Passowrd(password) {
  return md5(salt + password)
}