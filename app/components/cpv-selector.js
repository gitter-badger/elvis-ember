import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['cpv-selector'],
  checkedItems: [],
  refresh: true,
  table: {},
  // dataSet: [],
  // columns: [
  //   {
  //     'propertyName': 'key',
  //     'title': 'Code'
  //   },
  //   {
  //     'propertyName': 'name',
  //     'title': 'Description'
  //   },
  //   {
  //     'propertyName': 'doc_count',
  //     'title': 'Count'
  //   }
  // ],
  didInsertElement() {
    console.log(this.get('cpvs'));
    let self = this;
    self.set('table', Ember.$('#cpv-table').DataTable({
      data: self.get('cpvs'),
      columns: [
        { title: 'Code' },
        { title: 'Description' },
        { title: 'Count' }
      ],
      info: false,
      paging: false,
      scrollY: '60vh',
      scrollCollapse: true,
      createdRow: function(row, data) {
        Ember.$(row).attr('id', `tr-${data[0]}`);
        Ember.$(row).attr('title', data[1]);
        if (Ember.$.grep(self.get('checkedItems'),
                         (obj) => {
                           return obj.code === data[0];
                         }).length > 0
        ) {
          Ember.$(row).addClass('hide');
        }
      }
    }));
    Ember.$('#cpv-table tbody').on('click', 'tr', function() {
      self.set('refresh', false);
      Ember.$(this).toggleClass('hide');

      self.get('checkedItems').push(
        {
          code: Ember.$(this).attr('id').substr(3),
          description: Ember.$(this).attr('title')
        }
      );

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
    Ember.$('div.chip').click(function() {
      self.set('refresh', false);
      let selected = Ember.$(this).attr('id').substr(5);
      Ember.$(`#tr-${selected}`).toggleClass('hide');

      let pos = self.get('checkedItems').map((obj) => obj.code).indexOf(selected);
      self.get('checkedItems').splice(pos, 1);

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
  },
  //willClearRender() {
  //  this.set('table', {});
  //},
  didUpdate() {
    let self = this;
    Ember.$('div.chip').click(function() {
      self.set('refresh', false);
      let selected = Ember.$(this).attr('id').substr(5);
      Ember.$(`#tr-${selected}`).toggleClass('hide');

      let pos = self.get('checkedItems').map((obj) => obj.code).indexOf(selected);
      self.get('checkedItems').splice(pos, 1);

      Ember.run.next(function() {
        self.set('refresh', true);
      });
    });
  },
  actions: {
    toggleModal() {
      this.get('targetObject').send('toggleModal');
    },
    selectCpv(code) {
      // console.log('Selected ', code);
      // console.log('Controller ', this.get('cpvs'));
      let item;
      [item] = this.get('cpvs').filter((value) => {
        if (value.key === code) {
          value.checked = 'checked';
          return true;
        } else {
          return false;
        }
      });
      // console.log('Item: ', item.name);
      // console.log('Checked: ', item.checked);

      this.get('checkedItems').push(code);

      // console.log(this.get('checkedItems'));
    }
  }
});
