import { User, IUser } from '../entities/User';

/** Data required to create a user; _id is optional (defaults in schema). */
export type CreateUserData = Omit<IUser, 'createdAt' | 'updatedAt' | '_id'> & { _id?: string };

export const userRepository = {
  async create(data: CreateUserData): Promise<IUser> {
    const user = new User(data);
    return user.save();
  },

  async findByEmail(email: string, includePassword = false): Promise<IUser | null> {
    return User.findOne({ Email: email.toLowerCase() })
      .select(includePassword ? '+Password' : '')
      .lean()
      .exec()
      .then((doc) => (doc ? (doc as IUser) : null));
  },

  async findById(id: string): Promise<IUser | null> {
    return User.findOne({ Id: id }).lean().exec().then((doc) => (doc ? (doc as IUser) : null));
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await User.countDocuments({ Email: email.toLowerCase() }).exec();
    return count > 0;
  },
};
