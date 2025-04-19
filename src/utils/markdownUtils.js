
// 마크다운 커스텀 하는 곳
const markdownComponents = {
    //code 인라인이랑 블록
    code({ node, inline, className, children, ...props }) {
      if (inline) {
        return <>{children}</>;
      }
      return (
        <pre className="bg-gray-100 p-2 rounded" {...props}>
          <code className={className}>
            {children}
          </code>
        </pre>
      );
    },
    
    //제외 할 명령어 모음
    p({ node, children }) { return <>{children}</>; },
    h1({ node, children }) { return <>{children}</>; },
    h2({ node, children }) { return <>{children}</>; },
    h3({ node, children }) { return <>{children}</>; },
    h4({ node, children }) { return <>{children}</>; },
    h5({ node, children }) { return <>{children}</>; },
    h6({ node, children }) { return <>{children}</>; },
    em({ node, children }) { return <>{children}</>; },
    strong({ node, children }) { return <>{children}</>; },
    blockquote({ node, children }) { return <>{children}</>; },
    ul({ node, children }) { return <>{children}</>; },
    ol({ node, children }) { return <>{children}</>; },
    li({ node, children }) { return <>{children}</>; },
    a({ node, children }) { return <>{children}</>; }
  };

  export { markdownComponents }