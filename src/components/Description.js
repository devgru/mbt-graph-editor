import React, {Component} from 'react';

import './Description.css';

class Description extends Component {
  render() {
    return (
      <div className="Description">
        <p className="Description__line">
          Двойной клик в рабочей области добавляет точку.
        </p>
        <p className="Description__line">
          Двойной клик на точку удаляет точку и её связи.
        </p>
        <p className="Description__line">
          Клик на точку позволяет создать связь с другой точкой.
        </p>
        <p className="Description__line">
          Точки можно перетаскивать.
        </p>
        <p className="Description__line">
          Клик в рабочую область или в текущую точку останавливает добавление связей.
        </p>
        <p className="Description__line">
          Рабочую область можно перемещать перетаскиванием и масштабировать прокруткой.
        </p>
      </div>
    );
  }
}

export default Description;
