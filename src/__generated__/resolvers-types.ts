import { GraphQLResolveInfo } from 'graphql';
import { BoardContext } from '../index';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Board = {
  __typename?: 'Board';
  columns: Array<Column>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Card = {
  __typename?: 'Card';
  column: Column;
  description: Scalars['String'];
  id: Scalars['ID'];
  position: Scalars['Int'];
  title: Scalars['String'];
};

export type Column = {
  __typename?: 'Column';
  board: Board;
  cards: Array<Card>;
  id: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBoard: Board;
  createCard: Card;
  createColumn: Column;
  moveCard: Card;
};


export type MutationCreateBoardArgs = {
  name: Scalars['String'];
};


export type MutationCreateCardArgs = {
  columnId: Scalars['ID'];
  description: Scalars['String'];
  position: Scalars['Int'];
  title: Scalars['String'];
};


export type MutationCreateColumnArgs = {
  boardId: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Int'];
};


export type MutationMoveCardArgs = {
  cardId: Scalars['ID'];
  targetColumnId: Scalars['ID'];
  targetPosition: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  board: Board;
  boards: Array<Board>;
};


export type QueryBoardArgs = {
  id: Scalars['ID'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Board: ResolverTypeWrapper<Board>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Card: ResolverTypeWrapper<Card>;
  Column: ResolverTypeWrapper<Column>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Board: Board;
  Boolean: Scalars['Boolean'];
  Card: Card;
  Column: Column;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
}>;

export type BoardResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Board'] = ResolversParentTypes['Board']> = ResolversObject<{
  columns?: Resolver<Array<ResolversTypes['Column']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CardResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = ResolversObject<{
  column?: Resolver<ResolversTypes['Column'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ColumnResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Column'] = ResolversParentTypes['Column']> = ResolversObject<{
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType>;
  cards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationCreateBoardArgs, 'name'>>;
  createCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationCreateCardArgs, 'columnId' | 'description' | 'position' | 'title'>>;
  createColumn?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<MutationCreateColumnArgs, 'boardId' | 'name' | 'position'>>;
  moveCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationMoveCardArgs, 'cardId' | 'targetColumnId' | 'targetPosition'>>;
}>;

export type QueryResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<QueryBoardArgs, 'id'>>;
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
}>;

export type Resolvers<ContextType = BoardContext> = ResolversObject<{
  Board?: BoardResolvers<ContextType>;
  Card?: CardResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
}>;

