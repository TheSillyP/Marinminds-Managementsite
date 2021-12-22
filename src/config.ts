import { EUserStatus } from './data/types'

export const EMAIL_REGEX = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/ // eslint-disable-line
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/ // eslint-disable-line
export const PHONE_REGEX = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g // eslint-disable-line

export const AWS_REGION = 'eu-west-1'
export const AWS_COGNITO_REGION = 'eu-west-1'
export const AWS_COGNITO_IDENTITY_POOL_ID = 'eu-west-1:3ffdbbef-bdfe-4b80-be12-7ec6e2fb7b4f'
export const AWS_COGNITO_USER_POOL_ID = 'eu-west-1_ZEToWa5Sa'
export const AWS_COGNITO_CLIENT_ID = '7jjsp8i4do2kbsh09aubmlb574'

export const CDN_URL = 'https://drbwnfea1gxrk.cloudfront.net'

export const isValidEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email.toLowerCase())
}

export const isValidPassword = (password: string): boolean => {
  return PASSWORD_REGEX.test(password)
}

export const isValidPhonenumber = (phoneNumber: string): boolean => {
  return PHONE_REGEX.test(phoneNumber)
}

export const capitalise = (str: string): string => {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}

export const AWS_CONFIG = {
  aws_project_region: AWS_REGION,
  aws_cognito_identity_pool_id: AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: AWS_COGNITO_REGION,
  aws_user_pools_id: AWS_COGNITO_USER_POOL_ID,
  aws_user_pools_web_client_id: AWS_COGNITO_CLIENT_ID,
  oauth: {},
}

export const getStatusColor = (status: EUserStatus): string => {
  switch (status) {
    case EUserStatus.ARCHIVED:
    case EUserStatus.UNCONFIRMED:
      return 'grey'

    case EUserStatus.COMPROMISED:
    case EUserStatus.UNKNOWN:
      return 'red'

    case EUserStatus.CONFIRMED:
      return 'green'

    case EUserStatus.FORCE_CHANGE_PASSWORD:
    case EUserStatus.RESET_REQUIRED:
      return 'blue'

    default:
      return 'yellow'
  }
}