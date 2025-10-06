export class ZodError extends Error {
  issues: { path: (string | number)[]; message: string }[];

  constructor(issues: { path: (string | number)[]; message: string }[]) {
    super(issues.map((issue) => `${issue.path.join('.') || 'value'}: ${issue.message}`).join('; '));
    this.issues = issues;
    this.name = 'ZodError';
  }
}

abstract class ZodType<T> {
  readonly _output!: T;

  optional(): ZodOptional<T> {
    return new ZodOptional<T>(this);
  }

  parse(input: unknown): T {
    const result = this.safeParse(input);
    if (result.success) {
      return result.data;
    }

    throw result.error;
  }

  safeParse(input: unknown): { success: true; data: T } | { success: false; error: ZodError } {
    try {
      return { success: true, data: this._parse(input, []) };
    } catch (error) {
      if (error instanceof ZodError) {
        return { success: false, error };
      }

      throw error;
    }
  }

  protected abstract _parse(input: unknown, path: (string | number)[]): T;
}

class ZodOptional<T> extends ZodType<T | undefined> {
  constructor(private readonly inner: ZodType<T>) {
    super();
  }

  protected _parse(input: unknown, path: (string | number)[]): T | undefined {
    if (input === undefined || input === null) {
      return undefined;
    }

    return this.inner._parse(input, path);
  }
}

class ZodString extends ZodType<string> {
  private minLength?: { value: number; message?: string };
  private maxLength?: { value: number; message?: string };

  min(value: number, message?: string): this {
    this.minLength = { value, message };
    return this;
  }

  max(value: number, message?: string): this {
    this.maxLength = { value, message };
    return this;
  }

  protected _parse(input: unknown, path: (string | number)[]): string {
    if (typeof input !== 'string') {
      throw new ZodError([{ path, message: 'Expected string' }]);
    }

    if (this.minLength && input.length < this.minLength.value) {
      throw new ZodError([
        {
          path,
          message: this.minLength.message ?? `Expected minimum length of ${this.minLength.value}`,
        },
      ]);
    }

    if (this.maxLength && input.length > this.maxLength.value) {
      throw new ZodError([
        {
          path,
          message: this.maxLength.message ?? `Expected maximum length of ${this.maxLength.value}`,
        },
      ]);
    }

    return input;
  }
}

class ZodArray<T> extends ZodType<T[]> {
  private minLength?: { value: number; message?: string };
  private maxLength?: { value: number; message?: string };

  constructor(private readonly element: ZodType<T>) {
    super();
  }

  min(value: number, message?: string): this {
    this.minLength = { value, message };
    return this;
  }

  max(value: number, message?: string): this {
    this.maxLength = { value, message };
    return this;
  }

  protected _parse(input: unknown, path: (string | number)[]): T[] {
    if (!Array.isArray(input)) {
      throw new ZodError([{ path, message: 'Expected array' }]);
    }

    if (this.minLength && input.length < this.minLength.value) {
      throw new ZodError([
        {
          path,
          message: this.minLength.message ?? `Expected at least ${this.minLength.value} items`,
        },
      ]);
    }

    if (this.maxLength && input.length > this.maxLength.value) {
      throw new ZodError([
        {
          path,
          message: this.maxLength.message ?? `Expected at most ${this.maxLength.value} items`,
        },
      ]);
    }

    return input.map((item, index) => this.element._parse(item, [...path, index]));
  }
}

type Shape = Record<string, ZodType<unknown>>;

type ZodInfer<T extends ZodType<unknown>> = T["_output"];

class ZodObject<T extends Shape> extends ZodType<{ [K in keyof T]: ZodInfer<T[K]> }> {
  constructor(private readonly shape: T) {
    super();
  }

  protected _parse(input: unknown, path: (string | number)[]): { [K in keyof T]: ZodInfer<T[K]> } {
    if (typeof input !== 'object' || input === null || Array.isArray(input)) {
      throw new ZodError([{ path, message: 'Expected object' }]);
    }

    const result: Record<string, unknown> = {};

    for (const key of Object.keys(this.shape) as (keyof T)[]) {
      const value = (input as Record<string, unknown>)[key as string];
      result[key as string] = this.shape[key]._parse(value, [...path, key as string]);
    }

    return result as { [K in keyof T]: ZodInfer<T[K]> };
  }
}

export const z = {
  string: () => new ZodString(),
  array: <T>(schema: ZodType<T>) => new ZodArray(schema),
  object: <T extends Shape>(shape: T) => new ZodObject(shape),
};

export type ZodSchema<T> = ZodType<T>;
