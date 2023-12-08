import { useRef, useState } from 'react';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import './app.css';

const prompt = PromptTemplate.fromTemplate(
  'Generate a pure typescript function for that follows the spec: {spec} With the input: {input} it should return: {output}. Always make it typesafe and pure.'
);

export function App() {
  const [token, setToken] = useState<string | null>(null);
  const [spec, setSpec] = useState<string>(
    'a noneNullable typesafe function to use with Use with filter() to remove null and undefined from an array but keep the type'
  );
  const [input, setInput] = useState<string>(
    '[1, 2, 0, null].filter(nonNullable) '
  );
  const [output, setOutput] = useState<string>('[1, 2, 0]: number[]');
  const [code, setCode] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const llm = useRef<OpenAI | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    if (!token || !spec || !input || !output) {
      setCode('Please fill out all fields');
      return;
    }

    if (!llm.current) {
      llm.current = new OpenAI({
        openAIApiKey: token,
      });
    }

    const formattedPrompt = await prompt.format({
      spec,
      input,
      output,
    });

    const llmResult = await llm.current.predict(formattedPrompt);

    llmResult && setCode(llmResult);
    setLoading(false);
  };

  return (
    <div className="container">
      <code>
        <pre>{loading ? 'waiting...' : code}</pre>
      </code>
      <form>
        <div className="field">
          <label>OpenAI Token</label>
          <input
            type="password"
            name="openai_token"
            id="openai_token"
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Function Spec</label>
          <textarea
            name="spec"
            id="spec"
            value={spec}
            onChange={(e) => setSpec(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Function Input</label>
          <textarea
            name="input"
            value={input}
            id="input"
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Function Output</label>
          <textarea
            name="output"
            value={output}
            id="output"
            onChange={(e) => setOutput(e.target.value)}
          />
        </div>
        <button type="button" onClick={() => handleSubmit()}>
          Ask the Ai
        </button>
      </form>
    </div>
  );
}

export default App;
