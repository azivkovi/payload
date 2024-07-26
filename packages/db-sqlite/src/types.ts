import type { Client, Config, ResultSet } from '@libsql/client'
import type { Operators } from '@payloadcms/drizzle'
import type { BuildQueryJoinAliases, DrizzleAdapter } from '@payloadcms/drizzle/types'
import type { ColumnDataType, DrizzleConfig, Relation, Relations, SQL } from 'drizzle-orm'
import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type {
  SQLiteColumn,
  SQLiteInsertOnConflictDoUpdateConfig,
  SQLiteTableWithColumns,
  SQLiteTransactionConfig,
} from 'drizzle-orm/sqlite-core'
import type { SQLiteRaw } from 'drizzle-orm/sqlite-core/query-builders/raw'
import type { Payload, PayloadRequest } from 'payload'

export type Args = {
  client: Config
  idType?: 'serial' | 'uuid'
  localesSuffix?: string
  logger?: DrizzleConfig['logger']
  migrationDir?: string
  push?: boolean
  relationshipsSuffix?: string
  schemaName?: string
  transactionOptions?: SQLiteTransactionConfig | false
  versionsSuffix?: string
}

export type GenericColumn = SQLiteColumn<
  {
    baseColumn: never
    columnType: string
    data: unknown
    dataType: ColumnDataType
    driverParam: unknown
    enumValues: string[]
    hasDefault: false
    name: string
    notNull: false
    tableName: string
  },
  object
>

export type GenericColumns = {
  [x: string]: GenericColumn
}

export type GenericTable = SQLiteTableWithColumns<{
  columns: GenericColumns
  dialect: string
  name: string
  schema: string
}>

export type GenericRelation = Relations<string, Record<string, Relation<string>>>

export type CountDistinct = (args: {
  db: LibSQLDatabase
  joins: BuildQueryJoinAliases
  tableName: string
  where: SQL
}) => Promise<number>

export type DeleteWhere = (args: {
  db: LibSQLDatabase
  tableName: string
  where: SQL
}) => Promise<void>

export type DropDatabase = (args: { adapter: SQLiteAdapter }) => Promise<void>

export type Execute<T> = (args: {
  db?: LibSQLDatabase
  drizzle?: LibSQLDatabase
  raw?: string
  sql?: SQL<unknown>
}) => SQLiteRaw<Promise<T>> | SQLiteRaw<ResultSet>

export type Insert = (args: {
  db: LibSQLDatabase
  onConflictDoUpdate?: SQLiteInsertOnConflictDoUpdateConfig<any>
  tableName: string
  values: Record<string, unknown> | Record<string, unknown>[]
}) => Promise<Record<string, unknown>[]>

// Explicitly omit drizzle property for complete override in SQLiteAdapter, required in ts 5.5
type SQLiteDrizzleAdapter = Omit<
  DrizzleAdapter,
  | 'countDistinct'
  | 'deleteWhere'
  | 'drizzle'
  | 'dropDatabase'
  | 'execute'
  | 'insert'
  | 'operators'
  | 'relations'
>

export type SQLiteAdapter = {
  client: Client
  clientConfig: Args['client']
  countDistinct: CountDistinct
  defaultDrizzleSnapshot: any
  deleteWhere: DeleteWhere
  drizzle: LibSQLDatabase
  dropDatabase: DropDatabase
  execute: Execute<unknown>
  /**
   * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
   * Used for returning properly formed errors from unique fields
   */
  fieldConstraints: Record<string, Record<string, string>>
  idType: Args['idType']
  initializing: Promise<void>
  insert: Insert
  localesSuffix?: string
  logger: DrizzleConfig['logger']
  operators: Operators
  push: boolean
  rejectInitializing: () => void
  relations: Record<string, GenericRelation>
  relationshipsSuffix?: string
  resolveInitializing: () => void
  schema: Record<string, GenericRelation | GenericTable>
  schemaName?: Args['schemaName']
  tableNameMap: Map<string, string>
  tables: Record<string, GenericTable>
  transactionOptions: SQLiteTransactionConfig
  versionsSuffix?: string
} & SQLiteDrizzleAdapter

export type IDType = 'integer' | 'numeric' | 'text'

export type MigrateUpArgs = {
  db: LibSQLDatabase
  payload: Payload
  req?: Partial<PayloadRequest>
}
export type MigrateDownArgs = {
  db: LibSQLDatabase
  payload: Payload
  req?: Partial<PayloadRequest>
}

declare module 'payload' {
  export interface DatabaseAdapter
    extends Omit<Args, 'idType' | 'logger' | 'migrationDir' | 'pool'>,
      DrizzleAdapter {
    beginTransaction: (options?: SQLiteTransactionConfig) => Promise<null | number | string>
    /**
     * An object keyed on each table, with a key value pair where the constraint name is the key, followed by the dot-notation field name
     * Used for returning properly formed errors from unique fields
     */
    fieldConstraints: Record<string, Record<string, string>>
    idType: Args['idType']
    initializing: Promise<void>
    localesSuffix?: string
    logger: DrizzleConfig['logger']
    push: boolean
    rejectInitializing: () => void
    relationshipsSuffix?: string
    resolveInitializing: () => void
    schema: Record<string, GenericRelation | GenericTable>
    tableNameMap: Map<string, string>
    transactionOptions: SQLiteTransactionConfig
    versionsSuffix?: string
  }
}
