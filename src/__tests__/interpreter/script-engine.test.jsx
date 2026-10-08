import { QueryClient } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import createStore, { readState } from '@/helpers/createStore';
import CoreContext from '@/interpreter/script/context/CoreContext';
import ReportContext from '@/interpreter/script/context/ReportContext';
import ScriptEngine from '@/interpreter/script/ScriptEngine';

let mockRuntime;

jest.mock('react-router', () => ({
  useNavigate: jest.fn(),
  useSearchParams: jest.fn(),
}));

jest.mock('@/interpreter/script/ScriptRuntime', () => ({
  scriptQueryKey: (scriptId) => ['script-run', scriptId],
  useScriptRuntime: () => mockRuntime,
}));

const createRuntime = () => {
  const runtime = {
    actions: {},
    fetchScript: jest.fn(() => Promise.resolve({ data: [{ name: 'Ana' }] })),
    latest: { current: {} },
    queryClient: new QueryClient(),
    stores: {
      formData: createStore({}),
      parameter: createStore(new URLSearchParams('id=7')),
      report: createStore(false),
      uiStore: createStore({}),
    },
    zbuilder: {},
  };
  runtime.zcore = CoreContext(runtime, readState);
  runtime.zreport = ReportContext(runtime, readState);
  return runtime;
};

let renderCount = 0;

const Probe = ({ code, isBuilder = false }) => {
  const scriptEngine = ScriptEngine({ isBuilder });
  renderCount++;
  return <span data-testid="out">{String(scriptEngine.evaluate(code))}</span>;
};

const output = () => screen.getByTestId('out').textContent;

describe('ScriptEngine', () => {
  beforeEach(() => {
    mockRuntime = createRuntime();
    renderCount = 0;
  });

  afterEach(() => {
    mockRuntime.queryClient.clear();
  });

  it('re-renders only when a form field read by the expression changes', () => {
    render(<Probe code="zcore.formData.get('a') || 'empty'" />);
    const { formData } = mockRuntime.stores;

    expect(output()).toBe('empty');
    const initialRenders = renderCount;

    act(() => formData.setState({ ...formData.getState(), b: 'other' }));
    expect(renderCount).toBe(initialRenders);

    act(() => mockRuntime.zcore.formData.set('a', 'hello'));
    expect(output()).toBe('hello');
    expect(renderCount).toBe(initialRenders + 1);
  });

  it('keeps consecutive formData.set calls in one script', () => {
    mockRuntime.zcore.formData.set('a', 1);
    mockRuntime.zcore.formData.set('b', 2);

    expect(mockRuntime.stores.formData.getState()).toEqual({ a: 1, b: 2 });
  });

  it('reads url parameters and zreport.loading reactively', () => {
    render(<Probe code="zcore.parameter.get('id') + ':' + zreport.loading" />);
    expect(output()).toBe('7:false');

    act(() => mockRuntime.stores.report.setState(true));
    expect(output()).toBe('7:true');
  });

  it('runs zquery and re-renders when the result arrives', async () => {
    render(<Probe code="zquery('s1', true, 'name')" />);

    expect(output()).toBe('null');
    await waitFor(() => expect(output()).toBe('Ana'));
    expect(mockRuntime.fetchScript).toHaveBeenCalledTimes(1);
  });

  it('does not run zquery in the builder', () => {
    render(<Probe code="zquery('s1')" isBuilder />);

    expect(output()).toBe('null');
    expect(mockRuntime.fetchScript).not.toHaveBeenCalled();
  });

  it('keeps the same hooks when the expression changes', () => {
    const { rerender } = render(<Probe code="zquery('s1')" />);

    expect(() => rerender(<Probe code="'plain'" />)).not.toThrow();
    expect(output()).toBe('plain');
  });
});
