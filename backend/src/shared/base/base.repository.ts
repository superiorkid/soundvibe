import { DatabaseService } from '../database/database.service';

export abstract class BaseRepository<
  TModel,
  TDelegate extends {
    findUnique: (args: any) => Promise<TModel | null>;
    findMany: (args: any) => Promise<TModel[]>;
    create: (args: any) => Promise<TModel>;
    update: (args: any) => Promise<TModel>;
    delete: (args: any) => Promise<TModel>;
    count?: (args: any) => Promise<number>;
  },
  TWhereUnique,
  TWhere,
  TCreate,
  TUpdate,
  TOrderBy,
  TInclude,
> {
  constructor(
    protected readonly prisma: DatabaseService,
    protected readonly delegate: TDelegate,
  ) {}

  async findAll(args?: {
    skip?: number;
    take?: number;
    cursor?: TWhereUnique;
    where?: TWhere;
    orderBy?: TOrderBy;
    include?: TInclude;
  }): Promise<TModel[]> {
    return this.delegate.findMany(args);
  }

  async findOne(args: {
    where: TWhereUnique;
    include?: TInclude;
  }): Promise<TModel | null> {
    return this.delegate.findUnique(args);
  }

  async create(data: { data: TCreate }): Promise<TModel> {
    return this.delegate.create(data);
  }

  async update(args: { where: TWhereUnique; data: TUpdate }): Promise<TModel> {
    return this.delegate.update(args);
  }

  async delete(args: { where: TWhereUnique }): Promise<TModel> {
    return this.delegate.delete(args);
  }

  async count(args?: { where?: TWhere }): Promise<number> {
    if (!this.delegate.count) {
      throw new Error('Count not implemented in delegate');
    }
    return this.delegate.count(args);
  }

  async exists(where: TWhereUnique): Promise<boolean> {
    const record = await this.delegate.findUnique({ where });
    return !!record;
  }
}
