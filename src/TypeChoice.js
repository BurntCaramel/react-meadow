import React, { PropTypes } from 'react';

import Meadow from './Meadow';

export default React.createClass({
  displayName: 'Meadow.TypeChoice',

  getDefaultProps() {
    return {
      types: [],
      onReplaceInfoAtKeyPath: null,
      tabIndex: 0
    };
  },

  shouldComponentUpdate(nextProps, nextState) {
    const currentProps = this.props;

    return (
      nextProps.types !== currentProps.types ||
      nextProps.value != currentProps.value ||
      nextProps.typeSpecs !== currentProps.typeSpecs ||
      nextProps.fieldSpecs !== currentProps.fieldSpecs ||
      nextProps.fieldComponent !== currentProps.fieldComponent ||
      nextProps.onReplaceInfoAtKeyPath !== currentProps.onReplaceInfoAtKeyPath
    );
  },

  getDefaultSelectedType() {
    // Choose first item by default.
    const { types } = this.props;
    if (types.length > 0) {
      return types[0];
    }
  },

  getSelectedType() {
    const { value } = this.props;
    let selectedType = value ? value.type : null;
    if (!selectedType) {
      selectedType = this.getDefaultSelectedType();
    }
    return selectedType;
  },

  onChangeType(newSelectedType) {
    if (!!value && (value.type === newSelectedType)) {
      return;
    }

    const info = {
      type: newSelectedType
    };

    this.props.onReplaceInfoAtKeyPath(info, []);
  },

  render() {
    const {
      types,
      value,
      typeSpecs,
      fieldSpecs,
      fieldComponent: Field,
      onReplaceInfoAtKeyPath,
      ...rest,
    } = this.props;

    const selectedType = this.getSelectedType();
    let selectedTypeSpec = null;

    types.some(typeID => {
      if (typeID === selectedType) {
        selectedTypeSpec = typeSpecs[typeID];;
      }

      return false;
    });

    const typeChoices = types.map(typeID => ({
      id: typeID,
      title: typeSpecs[typeID].title,
    }));

    let element = (
      <Field key='typeChoice'
        type='choice'
        value={ selectedType }
        choices={ typeChoices }
        { ...rest }
        onChangeValue={ this.onChangeType }
      />
    );

    let children = [ element ];

    // Show fields for the selected choice.
    if (!!selectedTypeSpec && !!selectedTypeSpec.fields) {
      children.push(
        <Meadow key='fields'
          fields={ selectedTypeSpec.fields }
          values={ value }
          typeSpecs={ typeSpecs }
          fieldSpecs={ fieldSpecs }
          fieldComponent={ Field }
          onReplaceInfoAtKeyPath={ onReplaceInfoAtKeyPath }
        />
      );
    }

    return (
      <div>{ children }</div>
    );
  },
});
