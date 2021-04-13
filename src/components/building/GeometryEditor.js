/* -*- coding: utf-8 -*-

Copyright (c) 2016-2021 Rafael Villar Burke <pachi@rvburke.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import React, { useEffect, useState, useRef } from "react";

/*
  The getElement function from customEditor takes two arguments,
  1. onUpdate: if you want to apply the modified data, call this function
  2. props: contains alls customEditorParameters, "row" with whole row data, "defaultValue" with the received object, and attrs
*/
export const GeometryFloatEditor = (props) => {
  const currentGeometry = props.defaultValue;
  const editableProp = props.prop;

  const inputRef = useRef(null);
  const [value, setValue] = useState(currentGeometry[editableProp]);
  useEffect(() => {
    inputRef.current.focus();
  });

  const updateData = () =>
    props.onUpdate({
      ...currentGeometry,
      [editableProp]: value,
    });

  return (
    <span>
      <input
        ref={inputRef}
        className={(props.editorClass || "") + " form-control editor edit-text"}
        style={{ display: "inline", width: "100%" }}
        type="text"
        value={value}
        onBlur={updateData}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateData();
          } else {
            props.onKeyDown(e);
          }
        }}
        onChange={(ev) => {
          setValue(parseFloat(ev.currentTarget.value.replace(",", ".")));
        }}
      />
      {/* <select
          value={ this.state.tilt }
          onKeyDown={ this.props.onKeyDown }
          onChange={ (ev) => { this.setState({ tilt: ev.currentTarget.value }); } } >
          { tilt.map(tilt => (<option key={ tilt } value={ tilt }>{ tilt }</option>)) }
        </select> */}
    </span>
  );
};
