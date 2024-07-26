import type { SanitizedCollectionConfig, VerifyConfig } from 'payload'

export type Props = {
  className?: string
  collectionSlug: SanitizedCollectionConfig['slug']
  disableLocalStrategy?: boolean
  email: string
  loginWithUsername: SanitizedCollectionConfig['auth']['loginWithUsername']
  operation: 'create' | 'update'
  readOnly: boolean
  requirePassword?: boolean
  setSchemaPath: (path: string) => void
  useAPIKey?: boolean
  username: string
  verify?: VerifyConfig | boolean
}
