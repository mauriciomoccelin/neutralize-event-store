export class PageRequest {
  limit!: number;
  offset!: number;
  type?: string;
  datetime!: string;

  static normalize(input: PageRequest): PageRequest {
    const maxItemsResult = 10;

    input.datetime = new Date(input.datetime).toJSON();
    input.offset = input.offset <= 0 ? 1 : input.offset;
    input.limit = input.limit > maxItemsResult ? maxItemsResult : input.limit;

    return input;
  }
}
