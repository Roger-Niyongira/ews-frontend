const mockAxios: any = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

mockAxios.create = jest.fn(() => mockAxios);

export default mockAxios;