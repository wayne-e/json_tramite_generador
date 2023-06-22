function data() {
  return {
    payload: '',
    elementOption: '',
    selectedGroup: '',
    defaultExist: false,
    control_options: {
      type_control: 'input',
      label_control: '',
      key_control: '',
      placeholder: '',
      header_control: '',
      is_colection: true,
      enpoint_control: '',
      name_object: '',
      options: [],
      is_required: true,
      data_type_control: 'string'
    },
    control_groups: [],
    tables: [],
    files: [],
    success: {
      add_element: 'Elemento añadido',
      element_removed: 'Elemento eliminado',
      control: 'Control agregado',
      control_removed: 'Control eliminado',
      file: 'File agregado',
      file_removed: 'File eliminado'
    },
    errors: {
      complete: 'Llena los campos correctamente'
    },
    swal_error: Swal.mixin({
      icon: 'error',
      toast: true,
      position: 'bottom-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false
    }),
    swal_success: Swal.mixin({
      icon: 'success',
      toast: true,
      position: 'bottom-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false
    }),
    swal_info: Swal.mixin({
      icon: 'info',
      toast: true,
      position: 'bottom-right',
      iconColor: 'white',
      customClass: {
        popup: 'colored-toast'
      },
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false
    }),
    addControlGroup: function () {
      let key = document.getElementById('key_grupo')
      let label = document.getElementById('label_grupo')
      if (key.value && !(key.value == 'default' && this.defaultExist)) {
        let control_group = {}
        control_group['key'] = key.value
        if (key.value == 'default') {
          this.defaultExist = true
        }
        control_group['label'] = label.value
        control_group['controls'] = []
        document.getElementById('close_modal').click()
        if (this.elementOption === 'table') {
          this.tables.push(control_group)
        } else {
          this.control_groups.push(control_group)
        }
        key.value = ''
        label.value = ''
        this.swal_success.fire({ title: this.success.add_element })
        this.newPayload()
      } else {
        this.swal_error.fire({ title: this.errors.complete })
      }
    },
    removeControlGroup: function (groupKey, elOption) {
      this.elementOption = elOption
      if (this.elementOption === 'tables') {
        this.tables = this.tables.filter(control => control.key != groupKey)
      } else {
        this.control_groups = this.control_groups.filter(control => control.key != groupKey)
      }
      if (groupKey == 'default') {
        this.defaultExist = false
      }
      this.swal_info.fire({ title: this.success.element_removed })
      this.newPayload()
    },
    addControl: function (groupKey, elOption) {
      if (elOption) {
        this.elementOption = elOption
      }
      if (groupKey) {
        this.selectedGroup = groupKey
      } else {
        let control = new Object()
        let valid = true
        if (this.control_options.type_control === 'input' || this.control_options.type_control === 'textarea') {
          this.control_options.is_colection = false
          valid = (this.control_options.label_control && this.control_options.key_control && this.control_options.placeholder) ? true : false
        }
        else {
          this.control_options.placeholder = ''
          if (this.control_options.type_control === 'select') {
            this.control_options.placeholder = 'Seleccione una opción'
          }

          if (!this.control_options.label_control || !this.control_options.key_control) {
            valid = false
          }
          if (this.control_options.is_colection) {
            valid = this.control_options.enpoint_control ? true : false
            valid = this.control_options.name_object ? true : false
          }
          else {
            valid = this.control_options.options.length > 0 ? true : false
          }
        }
        if (this.elementOption === 'tables' && !this.control_options.header_control) {
          valid = false
        }
        if (valid) {
          for (const key in this.control_options) {
            control[key] = this.control_options[key]
          }
          if (this.elementOption === 'tables') {
            this.tables.forEach(el => {
              if (el.key === this.selectedGroup) {
                el.controls.push(control)
              }
            })
          } else {
            this.control_groups.forEach(el => {
              if (el.key === this.selectedGroup) {
                el.controls.push(control)
              }
            })
          }
          this.control_options.type_control = 'input'
          this.control_options.label_control = ''
          this.control_options.key_control = ''
          this.control_options.placeholder = ''
          this.control_options.header_control = ''
          this.control_options.is_colection = true
          this.control_options.enpoint_control = ''
          this.control_options.name_object = ''
          this.control_options.options = []
          this.control_options.is_required = true
          this.control_options.data_type_control = 'string'


          this.swal_success.fire({ title: this.success.control })
        }
        else {
          this.swal_error.fire({ title: this.errors.complete })
        }
      }
      this.newPayload()
    },
    removeControl: function (groupKey, controlKey, elOption) {
      if (elOption === 'tables') {
        this.tables.forEach(group => {
          if (group.key === groupKey) {
            group.controls = group.controls.filter(el => el.key_control != controlKey)
          }
        })
      } else {
        this.control_groups.forEach(group => {
          if (group.key === groupKey) {
            group.controls = group.controls.filter(el => el.key_control != controlKey)
          }
        })
      }
      this.swal_info.fire({ title: this.success.element_removed })
      this.newPayload()
    },
    addOption: function () {
      let option = document.getElementById('option_control')
      if (option) {
        this.control_options.options.push(option.value)
        option.value = ''
      }
    },
    addFile: function () {
      let key = document.getElementById('key_file')
      let label = document.getElementById('label_file')
      let required = document.getElementById('required_file')
      if (key.value && label.value) {
        let file = {}
        file['key'] = key.value
        file['label'] = label.value
        file['is_required'] = required.checked
        document.getElementById('close_modal_file').click()
        this.files.push(file)
        key.value = ''
        label.value = ''
        required.checked = true
        this.swal_success.fire({ title: this.success.add_element })
      } else {
        this.swal_error.fire({ title: this.errors.complete })
      }
      this.newPayload()
    },
    removeFile: function (fileKey) {
      this.files = this.files.filter(file => file.key != fileKey)
      this.swal_info.fire({ title: this.success.element_removed })
      this.newPayload()
    },
    newPayload: function () {
      let objeto = ''
      if (this.control_groups.length > 0 || this.tables.length > 0 || this.files.length > 0) {
        objeto = {
          control_groups: {},
          tables: {},
          files: {},
          submit: {
            method: 'POST',
            endpoint: document.getElementById('label_endpoint').value
          }
        }
      }

      this.control_groups.forEach(element => {
        let controls = {}
        element.controls.forEach(el => {
          controls[el.key_control] = {
            type: el.type_control,
            label: el.label_control,
            rules: {
              type: el.data_type_control,
              required: el.is_required
            },
            value: '',
            collection: {
              id: 0,
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: el.name_object
            },
            placeholder: el.placeholder
          }
        })

        objeto.control_groups[element.key] = {
          type: 'group',
          label: element.label,
          controls,
          collection: {
            id: 0,
            is: false,
            options: [],
            endpoint: "",
            name_object: ''
          },
        }
      })
      this.tables.forEach(element => {
        let controls = {}
        let headers = {}
        let body = {}
        element.controls.forEach((el, index) => {
          controls[el.key_control] = {
            type: el.type_control,
            label: el.label_control,
            rules: {
              type: el.data_type_control,
              required: el.is_required
            },
            value: '',
            collection: {
              id: 0,
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: el.name_object
            },
            placeholder: el.placeholder,
            position: index
          }
          headers[el.key_control] = {
            label: el.header_control,
            position: index
          }
          body[el.key_control] = {
            value: '',
            collection: {
              id: 0,
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: el.name_object
            }
          }
        })

        objeto.tables[element.key] = {
          name: element.label,
          body: [body],
          headers,
          controls
        }
      })
      this.files.forEach(element => {
        objeto.files[element.key] = {
          type: "pdf",
          label: element.label,
          encript: "",
          path_url: "",
          rules: {
            required: element.is_required
          }
        }
      })
      this.payload = objeto ? JSON.stringify(objeto) : ''
    },
    copyPayload: function () {
      this.newPayload()
      if (navigator.clipboard) {
        let mensaje = this.payload

        navigator.clipboard.writeText(mensaje)
          .then(() => {
            this.swal_success.fire({
              title: 'JSON copiado'
            })
          })
          .catch(error => {
            this.swal_error.fire({
              title: 'Error al copiar'
            })
          });
      }
      else {
        _copy_error();
      }
    }
  }
}