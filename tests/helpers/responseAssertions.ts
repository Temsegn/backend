/**
 * Assert API response matches spec: Base Response or Paginated Response.
 */
export function assertBaseResponse(body: unknown): asserts body is { Success: boolean; Message: string; Object: unknown; Errors: string[] | null } {
  expect(body).toBeDefined();
  expect(body).toHaveProperty('Success');
  expect(body).toHaveProperty('Message');
  expect(body).toHaveProperty('Object');
  expect(body).toHaveProperty('Errors');
  expect(typeof (body as any).Success).toBe('boolean');
  expect(typeof (body as any).Message).toBe('string');
  expect((body as any).Errors === null || Array.isArray((body as any).Errors)).toBe(true);
}

export function assertPaginatedResponse(body: unknown): void {
  assertBaseResponse(body);
  expect(body).toHaveProperty('PageNumber');
  expect(body).toHaveProperty('PageSize');
  expect(body).toHaveProperty('TotalSize');
  expect(typeof (body as any).PageNumber).toBe('number');
  expect(typeof (body as any).PageSize).toBe('number');
  expect(typeof (body as any).TotalSize).toBe('number');
  expect(Array.isArray((body as any).Object)).toBe(true);
}

export function assertSuccessBase(body: unknown): void {
  assertBaseResponse(body);
  expect((body as any).Success).toBe(true);
  expect((body as any).Errors).toBeNull();
}

export function assertErrorResponse(body: unknown, statusExpected?: number): void {
  assertBaseResponse(body);
  expect((body as any).Success).toBe(false);
  expect((body as any).Object).toBeNull();
  expect((body as any).Errors).toBeDefined();
  if (statusExpected !== undefined) expect((body as any).Errors).toBeDefined();
}
