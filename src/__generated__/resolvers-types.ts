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

export type Board = Node & {
  __typename?: 'Board';
  collaborators: Array<User>;
  columns: Array<Column>;
  favoritedBy: Array<User>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  user: User;
};

export type Card = Node & {
  __typename?: 'Card';
  column: Column;
  comments: CommentConnection;
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};


export type CardCommentsArgs = {
  after?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
};

export type Column = Node & {
  __typename?: 'Column';
  board: Board;
  cards: Array<Card>;
  id: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Int'];
};

export type Comment = {
  __typename?: 'Comment';
  card: Card;
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  updatedAt: Scalars['String'];
  user: User;
};

export type CommentConnection = {
  __typename?: 'CommentConnection';
  edges: Array<CommentEdge>;
  pageInfo: PageInfo;
};

export type CommentEdge = {
  __typename?: 'CommentEdge';
  cursor: Scalars['String'];
  node: Comment;
};

export type Mutation = {
  __typename?: 'Mutation';
  addCommentToCard: Comment;
  createBoard: Board;
  createCardFromComment: Column;
  createSimpleCard: Column;
  deleteCard: Column;
  moveCard: Board;
  removeComment: Comment;
  toggleFavoriteBoard: Board;
  updateBoardImageUrl: Board;
  updateBoardName: Board;
  updateCardDescription: Card;
  updateCardImageUrl: Card;
  updateCardTitle: Card;
};


export type MutationAddCommentToCardArgs = {
  cardId: Scalars['ID'];
  content: Scalars['String'];
};


export type MutationCreateBoardArgs = {
  name: Scalars['String'];
};


export type MutationCreateCardFromCommentArgs = {
  cardId: Scalars['ID'];
  description: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateSimpleCardArgs = {
  columnId: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationDeleteCardArgs = {
  cardId: Scalars['ID'];
};


export type MutationMoveCardArgs = {
  cardId: Scalars['ID'];
  targetColumnId: Scalars['ID'];
  targetPosition: Scalars['Int'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['ID'];
};


export type MutationToggleFavoriteBoardArgs = {
  boardId: Scalars['ID'];
};


export type MutationUpdateBoardImageUrlArgs = {
  boardId: Scalars['ID'];
  imageUrl: Scalars['String'];
};


export type MutationUpdateBoardNameArgs = {
  boardId: Scalars['ID'];
  name: Scalars['String'];
};


export type MutationUpdateCardDescriptionArgs = {
  cardId: Scalars['ID'];
  description: Scalars['String'];
};


export type MutationUpdateCardImageUrlArgs = {
  cardId: Scalars['ID'];
  imageUrl: Scalars['String'];
};


export type MutationUpdateCardTitleArgs = {
  cardId: Scalars['ID'];
  title: Scalars['String'];
};

export type Node = {
  id: Scalars['ID'];
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPreviousPage?: Maybe<Scalars['Boolean']>;
  lastCursor?: Maybe<Scalars['String']>;
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  board: Board;
  boards: Array<Board>;
  viewer?: Maybe<Viewer>;
};


export type QueryBoardArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
};

export type Viewer = {
  __typename?: 'Viewer';
  boards: Array<Board>;
  collaborateBoards: Array<Maybe<Board>>;
  favoriteBoards: Array<Maybe<Board>>;
  user?: Maybe<User>;
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
  Comment: ResolverTypeWrapper<Comment>;
  CommentConnection: ResolverTypeWrapper<CommentConnection>;
  CommentEdge: ResolverTypeWrapper<CommentEdge>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Board'] | ResolversTypes['Card'] | ResolversTypes['Column'];
  PageInfo: ResolverTypeWrapper<PageInfo>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<User>;
  Viewer: ResolverTypeWrapper<Viewer>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Board: Board;
  Boolean: Scalars['Boolean'];
  Card: Card;
  Column: Column;
  Comment: Comment;
  CommentConnection: CommentConnection;
  CommentEdge: CommentEdge;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Node: ResolversParentTypes['Board'] | ResolversParentTypes['Card'] | ResolversParentTypes['Column'];
  PageInfo: PageInfo;
  Query: {};
  String: Scalars['String'];
  User: User;
  Viewer: Viewer;
}>;

export type BoardResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Board'] = ResolversParentTypes['Board']> = ResolversObject<{
  collaborators?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  columns?: Resolver<Array<ResolversTypes['Column']>, ParentType, ContextType>;
  favoritedBy?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CardResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Card'] = ResolversParentTypes['Card']> = ResolversObject<{
  column?: Resolver<ResolversTypes['Column'], ParentType, ContextType>;
  comments?: Resolver<ResolversTypes['CommentConnection'], ParentType, ContextType, Partial<CardCommentsArgs>>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export type CommentResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  card?: Resolver<ResolversTypes['Card'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentConnectionResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['CommentConnection'] = ResolversParentTypes['CommentConnection']> = ResolversObject<{
  edges?: Resolver<Array<ResolversTypes['CommentEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentEdgeResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['CommentEdge'] = ResolversParentTypes['CommentEdge']> = ResolversObject<{
  cursor?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Comment'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addCommentToCard?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationAddCommentToCardArgs, 'cardId' | 'content'>>;
  createBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationCreateBoardArgs, 'name'>>;
  createCardFromComment?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<MutationCreateCardFromCommentArgs, 'cardId' | 'description' | 'title'>>;
  createSimpleCard?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<MutationCreateSimpleCardArgs, 'columnId' | 'title'>>;
  deleteCard?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<MutationDeleteCardArgs, 'cardId'>>;
  moveCard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationMoveCardArgs, 'cardId' | 'targetColumnId' | 'targetPosition'>>;
  removeComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationRemoveCommentArgs, 'commentId'>>;
  toggleFavoriteBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationToggleFavoriteBoardArgs, 'boardId'>>;
  updateBoardImageUrl?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationUpdateBoardImageUrlArgs, 'boardId' | 'imageUrl'>>;
  updateBoardName?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationUpdateBoardNameArgs, 'boardId' | 'name'>>;
  updateCardDescription?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardDescriptionArgs, 'cardId' | 'description'>>;
  updateCardImageUrl?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardImageUrlArgs, 'cardId' | 'imageUrl'>>;
  updateCardTitle?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardTitleArgs, 'cardId' | 'title'>>;
}>;

export type NodeResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Board' | 'Card' | 'Column', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type PageInfoResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  endCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hasNextPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  hasPreviousPage?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  lastCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<QueryBoardArgs, 'id'>>;
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  viewer?: Resolver<Maybe<ResolversTypes['Viewer']>, ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ViewerResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Viewer'] = ResolversParentTypes['Viewer']> = ResolversObject<{
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  collaborateBoards?: Resolver<Array<Maybe<ResolversTypes['Board']>>, ParentType, ContextType>;
  favoriteBoards?: Resolver<Array<Maybe<ResolversTypes['Board']>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = BoardContext> = ResolversObject<{
  Board?: BoardResolvers<ContextType>;
  Card?: CardResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CommentConnection?: CommentConnectionResolvers<ContextType>;
  CommentEdge?: CommentEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  PageInfo?: PageInfoResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Viewer?: ViewerResolvers<ContextType>;
}>;

