import React from 'react';

export default ({ snippetChange, snippets, currentSnippet }) => {
  const curSnip = snippets.find(snip => snip.id === currentSnippet)
  if (!curSnip) return null;
  return (
    <div id="snippets">
      <div className="row">
        <div className="snippet-titles col-xs-3">
        {
          snippets && snippets.map(snip =>
            <h3 key={snip.id}
              className={ snip.id === currentSnippet ? 'selected-snippet' : '' }
              onClick={ () => snippetChange(snip.id) }>
              {snip.title}
            </h3>
          )
        }
        </div>
        <div className="snippet-text col-xs-9">
          <p>{curSnip.description}</p>
        </div>
      </div>
    </div>
  )
}
