import React, { PropTypes } from 'react';

import TextualFieldMultiple from './TextualFieldMultiple';
import TextualField from './TextualField';
import ChoiceField from './ChoiceField';
import TypeChoice from './TypeChoice';

const MeadowItem = React.createClass({
  shouldComponentUpdate(nextProps, nextState) {
    const currentProps = this.props;

    return (
      nextProps.field !== currentProps.field ||
      nextProps.fieldSpecs !== currentProps.fieldSpecs ||
      nextProps.typeSpecs !== currentProps.typeSpecs ||
      nextProps.value !== currentProps.value ||
      nextProps.inMultiple != currentProps.inMultiple ||
      nextProps.fieldComponent !== currentProps.fieldComponent ||
      nextProps.groupComponent !== currentProps.groupComponent ||
      nextProps.multipleComponent !== currentProps.multipleComponent ||
      nextProps.onReplaceInfoAtKeyPath !== currentProps.onReplaceInfoAtKeyPath
    );
  },

  onAdd() {
    const { keyPath, value, onReplaceInfoAtKeyPath } = this.props;

    if (value) {
      const newIndex = value.length;
      onReplaceInfoAtKeyPath({}, keyPath.concat(newIndex));
    }
    else {
      onReplaceInfoAtKeyPath([{}], keyPath);
    }
  },

  onRemoveAtIndex(index) {
    const { keyPath, onReplaceInfoAtKeyPath } = this.props;
    onReplaceInfoAtKeyPath(null, keyPath.concat(index));
  },

  onChangeValue(newValue) {
    const { keyPath, onReplaceInfoAtKeyPath } = this.props;
    onReplaceInfoAtKeyPath(newValue, keyPath);
  },

  render() {
    const {
      keyPath,
      field: {
        type,
        id,
        multiple = false,
        title,
        description,
        ...rest,
      },
      fieldSpecs,
      typeSpecs,
      value,
      level,
      ignoreMultiple = false,
      inMultiple,
      Meadow,
      fieldComponent: Field,
      groupComponent,
      multipleComponent: Multiple,
      onReplaceInfoAtKeyPath,
    } = this.props;

    if (multiple && !ignoreMultiple) {
      return (
        <Multiple key={ id }
          keyPath={ keyPath }
          type={ type }
          level={ level }
          title={ title }
          description={ description }
          values={ value || [] }
          inMultiple={ inMultiple }
          itemComponent={ ({ value, index }) => (
            <MeadowItem
              keyPath={ keyPath.concat(index) }
              field={ this.props.field }
              fieldSpecs={ fieldSpecs }
              typeSpecs={ typeSpecs }
              value={ value }
              level={ level }
              title={ title }
              description={ description }
              ignoreMultiple
              multipleIndex={ index }
              inMultiple
              fieldComponent={ Field }
              groupComponent={ groupComponent }
              multipleComponent={ Multiple }
              onReplaceInfoAtKeyPath={ onReplaceInfoAtKeyPath }
            />
          ) }
          onAdd={ this.onAdd }
          onRemoveAtIndex={ this.onRemoveAtIndex }
        />
      );
    }
    else if (type === 'group') {
      return (
        <Meadow key={ id }
          { ...rest }
          keyPath={ keyPath }
          values={ value }
          fieldSpecs={ fieldSpecs }
          typeSpecs={ typeSpecs }
          title={ inMultiple ? undefined : title }
          description={ inMultiple ? undefined : description }
          inMultiple={ inMultiple }
          fieldComponent={ Field }
          groupComponent={ groupComponent }
          multipleComponent={ Multiple }
          level={ level + 1 }
          onReplaceInfoAtKeyPath={ onReplaceInfoAtKeyPath }
        />
      );
    }
    else if (type === 'typeChoice') {
      return (
        <TypeChoice key={ id }
          { ...rest }
          keyPath={ keyPath }
          value={ value }
          fieldSpecs={ fieldSpecs }
          typeSpecs={ typeSpecs }
          title={ title }
          description={ description }
          inMultiple={ inMultiple }
          fieldComponent={ Field }
          groupComponent={ groupComponent }
          multipleComponent={ Multiple }
          onReplaceInfoAtKeyPath={ onReplaceInfoAtKeyPath }
        />
      );
    }
    else if (type === 'choice') {
      return (
        <ChoiceField key={ id }
          { ...rest }
          keyPath={ keyPath }
          type={ type }
          value={ value }
          title={ title }
          description={ description }
          inMultiple={ inMultiple }
          fieldComponent={ Field }
          onChangeValue={ this.onChangeValue }
        />
      );
    }
    else if (type === 'boolean') {
      return (
        <Field key={ id }
          { ...rest }
          keyPath={ keyPath }
          type={ type }
          value={ value }
          title={ title }
          description={ description }
          inMultiple={ inMultiple }
          onChangeValue={ this.onChangeValue }
        />
      );
    }
    else {
      let props = {
        key: id,
        type,
        title,
        description,
        inMultiple,
        fieldComponent: Field,
      };

      if (multiple) {
        props.values = value;
        props.onChangeValueAtIndex = (newValue, valueIndex) => {
          onReplaceInfoAtKeyPath(newValue, keyPath.concat([id, valueIndex]));
        };

        return (
          <TextualFieldMultiple { ...props } keyPath={ keyPath } { ...rest } />
        );
      }
      else {
        props.value = value;
        props.onChangeValue = this.onChangeValue;

        return (
          <TextualField { ...props } keyPath={ keyPath } { ...rest } />
        );
      }
    }
  },
});

export default MeadowItem