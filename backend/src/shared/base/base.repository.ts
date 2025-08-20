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

  async findOne(
    where: TWhereUnique,
    include?: TInclude,
  ): Promise<TModel | null> {
    return this.delegate.findUnique({ where, include });
  }

  async create(data: TCreate): Promise<TModel> {
    return this.delegate.create({ data });
  }

  async update(where: TWhereUnique, data: TUpdate): Promise<TModel> {
    return this.delegate.update({ where, data });
  }

  async delete(where: TWhereUnique): Promise<TModel> {
    return this.delegate.delete({ where });
  }

  async count(where?: TWhere): Promise<number> {
    if (!this.delegate.count) {
      throw new Error('Count not implemented in delegate');
    }
    return this.delegate.count({ where });
  }

  async exists(where: TWhereUnique): Promise<boolean> {
    const record = await this.findOne(where);
    return !!record;
  }
}
