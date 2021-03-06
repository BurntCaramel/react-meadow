import React, { PropTypes } from 'react';
import defaultStyler from 'react-sow/default';

export default React.createClass({
  displayName: 'Meadow.Web.Multiple',

  shouldComponentUpdate(nextProps, nextState) {
    const currentProps = this.props;

    return (
      nextProps.values != currentProps.values ||
      nextProps.title !== currentProps.title ||
      nextProps.description !== currentProps.description
      //nextProps.itemComponent !== currentProps.itemComponent
    );
  },

  render() {
    const { keyPath, styler = defaultStyler, values, title, description, level, itemComponent: Item, onAdd, onRemoveAtIndex } = this.props;
    const {
      title: titleStyler = defaultStyler,
      description: descriptionStyler = defaultStyler,
      list: listStyler = defaultStyler,
      item: itemStyler = defaultStyler,
      removeButton: removeButtonStyler = defaultStyler,
      addButton: addButtonStyler = defaultStyler
    } = styler;
    const {
      content: itemContentStyler = defaultStyler
    } = itemStyler;

    const items = values.map((value, index) => (
      <li key={ index } { ...itemStyler() }>
        <div { ...itemContentStyler() }>
          <Item value={ value } index={ index } />
        </div>
        <button { ...removeButtonStyler({ children: 'Remove' }) } onClick={ () => onRemoveAtIndex(index) } />
      </li>
    ));

    return (
      <div { ...styler() }>
        { !!title && <div { ...titleStyler({ children: title }) } /> }
        { !!description && <div { ...descriptionStyler({ children: description }) } /> }
        <ol { ...listStyler({ level }) }>
          { items }
        </ol>
        <div>
          <button { ...addButtonStyler({ children: 'Add' }) } onClick={ () => onAdd() } />
        </div>
      </div>
    );
  }
});
