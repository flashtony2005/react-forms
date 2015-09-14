/**
 * @copyright 2015, Prometheus Research, LLC
 */

import React      from 'react';
import sinon      from 'sinon';
import Field      from '../Field';
import Input      from '../Input';
import Label      from '../Label';
import ErrorList  from '../ErrorList';

describe('<Field />', function() {

  function assertLabel(renderer, Component = Label) {
    let result = renderer.getRenderOutput();
    let label = result.props.children[0];
    assert(label);
    assert(label.type === Component);
    return label
  }

  function assertInput(renderer, Component = Input) {
    let result = renderer.getRenderOutput();
    let input = result.props.children[1];
    return input
  }

  function assertNoErrorList(renderer) {
    let result = renderer.getRenderOutput();
    let errorList = result.props.children[2];
    assert(!errorList);
  }

  function assertErrorList(renderer, Component = ErrorList) {
    let result = renderer.getRenderOutput();
    let input = result.props.children[2];
    assert(input);
    assert(input.type === Component);
    return input
  }

  it('renders an input with value', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {value: 'hello', params: {}};
    renderer.render(
      <Field formValue={formValue} />
    );
    let input = assertInput(renderer);
    assert(input.props.value === 'hello');
  });

  it('reacts on onChange (DOM event passed) from input by updating the formValue', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {value: 'hello', params: {}, update: sinon.spy()};
    renderer.render(
      <Field formValue={formValue} />
    );
    let input;
    input = assertInput(renderer);
    assert(input.props.value === 'hello');
    let event = {target: {value: 'changed!'}, stopPropagation: sinon.spy()};
    input.props.onChange(event);
    assert(event.stopPropagation.calledOnce);
    assert(formValue.update.calledOnce);
    assert(formValue.update.firstCall.args[0] === 'changed!');
  });

  it('reacts on onChange (value passed) from input by updating the formValue', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {value: 'hello', params: {}, update: sinon.spy()};
    renderer.render(
      <Field formValue={formValue} />
    );
    let input;
    input = assertInput(renderer);
    assert(input.props.value === 'hello');
    let value = 'changed!';
    input.props.onChange(value);
    assert(formValue.update.calledOnce);
    assert(formValue.update.firstCall.args[0] === 'changed!');
  });

  it('renders a label', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {value: 'hello', params: {}, schema: {}};
    renderer.render(
      <Field formValue={formValue} label="Label" />
    );
    let label = assertLabel(renderer);
    assert(label.props.label === 'Label');
    assert(label.props.schema === formValue.schema);
  });

  it('does not show error list if not dirty', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    renderer.render(
      <Field formValue={formValue} label="Label" />
    );
    assertNoErrorList(renderer);
  });

  it('renders an error list if it becomes dirty', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    renderer.render(
      <Field formValue={formValue} label="Label" />
    );
    assertNoErrorList(renderer);
    let self = renderer.getRenderOutput();
    assert(self.props.onBlur);
    self.props.onBlur();
    let errorList = assertErrorList(renderer);
    assert(errorList.props.formValue === formValue);
  });

  it('renders an error list if forced', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {params: {forceShowErrors: true}};
    renderer.render(
      <Field formValue={formValue} label="Label" />
    );
    let errorList = assertErrorList(renderer);
    assert(errorList.props.formValue === formValue);
  });

  it('virtualizes rendering of self component', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    function Custom(props) {
      return <div />;
    }
    renderer.render(
      <Field Self={Custom} formValue={formValue} />
    );
    let self = renderer.getRenderOutput();
    assert(self);
    assert(self.type === Custom);
  });

  it('virtualizes rendering of input component', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    function Custom(props) {
      return <div />;
    }
    renderer.render(
      <Field Input={Custom} formValue={formValue} />
    );
    assertInput(renderer, Custom);
  });

  it('virtualizes rendering of input component (via children element)', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    function Custom(props) {
      return <div />;
    }
    renderer.render(
      <Field formValue={formValue}>
        <Custom x="1" />
      </Field>
    );
    let input = assertInput(renderer, Custom);
    assert(input.props.x === '1');
  });

  it('virtualizes rendering of label component', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {};
    function Custom(props) {
      return <div />;
    }
    renderer.render(
      <Field Label={Custom} formValue={formValue} />
    );
    assertLabel(renderer, Custom);
  });

  it('virtualizes rendering of error list component', function() {
    let renderer = TestUtils.createRenderer();
    let formValue = {params: {forceShowErrors: true}};
    function Custom(props) {
      return <div />;
    }
    renderer.render(
      <Field ErrorList={Custom} formValue={formValue} />
    );
    assertErrorList(renderer, Custom);
  });

});
