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
  collaborators: Array<User>;
  columns: Array<Column>;
  favoritedBy: Array<User>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  user: User;
};

export type Card = {
  __typename?: 'Card';
  column: Column;
  comments: Array<Comment>;
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  position: Scalars['Int'];
  tags: Array<Tag>;
  title: Scalars['String'];
  updatedAt: Scalars['String'];
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

export type Mutation = {
  __typename?: 'Mutation';
  addCommentToCard: Comment;
  addTagToCard: Card;
  createBoard: Board;
  createCardFromComment: Card;
  createColumn: Column;
  createSimpleCard: Card;
  createTag: Tag;
  deleteCard: Card;
  favoriteBoard: Board;
  moveCard: Card;
  removeComment: Comment;
  removeTagFromCard: Card;
  unfavoriteBoard: Board;
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


export type MutationAddTagToCardArgs = {
  cardId: Scalars['ID'];
  tagId: Scalars['ID'];
};


export type MutationCreateBoardArgs = {
  name: Scalars['String'];
};


export type MutationCreateCardFromCommentArgs = {
  cardId: Scalars['ID'];
  description: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCreateColumnArgs = {
  boardId: Scalars['ID'];
  name: Scalars['String'];
  position: Scalars['Int'];
};


export type MutationCreateSimpleCardArgs = {
  columnId: Scalars['ID'];
  title: Scalars['String'];
};


export type MutationCreateTagArgs = {
  name: Scalars['String'];
};


export type MutationDeleteCardArgs = {
  cardId: Scalars['ID'];
};


export type MutationFavoriteBoardArgs = {
  boardId: Scalars['ID'];
};


export type MutationMoveCardArgs = {
  cardId: Scalars['ID'];
  targetColumnId: Scalars['ID'];
  targetPosition: Scalars['Int'];
};


export type MutationRemoveCommentArgs = {
  commentId: Scalars['ID'];
};


export type MutationRemoveTagFromCardArgs = {
  cardId: Scalars['ID'];
  tagId: Scalars['ID'];
};


export type MutationUnfavoriteBoardArgs = {
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

export type Query = {
  __typename?: 'Query';
  board: Board;
  boards: Array<Board>;
  card: Card;
  collaborateBoards: Array<Maybe<Board>>;
  collaborators: Array<User>;
  column: Column;
  comments: Array<Comment>;
  currentUser?: Maybe<User>;
  favoriteBoards: Array<Maybe<Board>>;
  node?: Maybe<Node>;
  tags: Array<Tag>;
};


export type QueryBoardArgs = {
  id: Scalars['ID'];
};


export type QueryCardArgs = {
  id: Scalars['ID'];
};


export type QueryCollaboratorsArgs = {
  boardId: Scalars['ID'];
};


export type QueryColumnArgs = {
  id: Scalars['ID'];
};


export type QueryCommentsArgs = {
  cardId: Scalars['ID'];
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};

export type Tag = {
  __typename?: 'Tag';
  cards: Array<Card>;
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatarUrl?: Maybe<Scalars['String']>;
  boards: Array<Board>;
  collaborations: Array<Board>;
  comments: Array<Comment>;
  email: Scalars['String'];
  favorites: Array<Board>;
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
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
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Node: ResolversTypes['Column'];
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Tag: ResolverTypeWrapper<Tag>;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Board: Board;
  Boolean: Scalars['Boolean'];
  Card: Card;
  Column: Column;
  Comment: Comment;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Node: ResolversParentTypes['Column'];
  Query: {};
  String: Scalars['String'];
  Tag: Tag;
  User: User;
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
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
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

export type MutationResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  addCommentToCard?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationAddCommentToCardArgs, 'cardId' | 'content'>>;
  addTagToCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationAddTagToCardArgs, 'cardId' | 'tagId'>>;
  createBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationCreateBoardArgs, 'name'>>;
  createCardFromComment?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationCreateCardFromCommentArgs, 'cardId' | 'description' | 'title'>>;
  createColumn?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<MutationCreateColumnArgs, 'boardId' | 'name' | 'position'>>;
  createSimpleCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationCreateSimpleCardArgs, 'columnId' | 'title'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'name'>>;
  deleteCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationDeleteCardArgs, 'cardId'>>;
  favoriteBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationFavoriteBoardArgs, 'boardId'>>;
  moveCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationMoveCardArgs, 'cardId' | 'targetColumnId' | 'targetPosition'>>;
  removeComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationRemoveCommentArgs, 'commentId'>>;
  removeTagFromCard?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationRemoveTagFromCardArgs, 'cardId' | 'tagId'>>;
  unfavoriteBoard?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationUnfavoriteBoardArgs, 'boardId'>>;
  updateBoardImageUrl?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationUpdateBoardImageUrlArgs, 'boardId' | 'imageUrl'>>;
  updateBoardName?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<MutationUpdateBoardNameArgs, 'boardId' | 'name'>>;
  updateCardDescription?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardDescriptionArgs, 'cardId' | 'description'>>;
  updateCardImageUrl?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardImageUrlArgs, 'cardId' | 'imageUrl'>>;
  updateCardTitle?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<MutationUpdateCardTitleArgs, 'cardId' | 'title'>>;
}>;

export type NodeResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Column', ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  board?: Resolver<ResolversTypes['Board'], ParentType, ContextType, RequireFields<QueryBoardArgs, 'id'>>;
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  card?: Resolver<ResolversTypes['Card'], ParentType, ContextType, RequireFields<QueryCardArgs, 'id'>>;
  collaborateBoards?: Resolver<Array<Maybe<ResolversTypes['Board']>>, ParentType, ContextType>;
  collaborators?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryCollaboratorsArgs, 'boardId'>>;
  column?: Resolver<ResolversTypes['Column'], ParentType, ContextType, RequireFields<QueryColumnArgs, 'id'>>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentsArgs, 'cardId'>>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  favoriteBoards?: Resolver<Array<Maybe<ResolversTypes['Board']>>, ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QueryNodeArgs, 'id'>>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
}>;

export type TagResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = ResolversObject<{
  cards?: Resolver<Array<ResolversTypes['Card']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<ContextType = BoardContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  boards?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  collaborations?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  favorites?: Resolver<Array<ResolversTypes['Board']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = BoardContext> = ResolversObject<{
  Board?: BoardResolvers<ContextType>;
  Card?: CardResolvers<ContextType>;
  Column?: ColumnResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;

