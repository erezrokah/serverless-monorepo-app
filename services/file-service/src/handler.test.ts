import { save } from './handler';

jest.mock('./fileSaver');

describe('handler', () => {
  const { saveFile } = require('./fileSaver');
  const response = {};
  const error = new Error('some error');

  const payload = {
    file_url:
      'https://assets-cdn.github.com/images/modules/open_graph/github-mark.png',
    key: 'github.png',
  };
  const event = { body: JSON.stringify(payload) };
  const context: any = null;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should call callback on response', async () => {
    saveFile.mockReturnValue(Promise.resolve({ response, error: null }));

    const callback = jest.fn();

    await save(event, context, callback);

    expect(saveFile).toHaveBeenCalledTimes(1);
    expect(saveFile).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, response);
  });

  test('should call callback on error', async () => {
    saveFile.mockReturnValue(Promise.resolve({ response, error }));

    const callback = jest.fn();

    await save(event, context, callback);

    expect(saveFile).toHaveBeenCalledTimes(1);
    expect(saveFile).toHaveBeenCalledWith(JSON.stringify(payload));
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(error);
  });
});
