function data() {
  return {
    payload: '',
    elementOption: '',
    selectedGroup: '',
    control_options: {
      type_control: 'input',
      label_control: '',
      key_control: '',
      placeholder: '',
      header_control: '',
      is_colection: true,
      enpoint_control: '',
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
      complete: 'Llena todos los campos'
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
    addControlGroup: function () {
      let key = document.getElementById('key_grupo')
      let label = document.getElementById('label_grupo')
      if (key && label) {
        let control_group = {}
        control_group['key'] = key.value
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
      } else {
        this.swal_error.fire({ title: this.errors.complete })
      }
      this.newPayload()
    },
    removeControlGroup: function (groupKey, elOption) {
      this.elementOption = elOption
      if (this.elementOption === 'tables') {
        this.tables = this.tables.filter(control => control.key != groupKey)
      } else {
        this.control_groups = this.control_groups.filter(control => control.key != groupKey)
      }
      this.swal_success.fire({ title: this.success.element_removed })
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
      if (key && label) {
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
      this.newPayload()
    },
    newPayload: function () {
      let objeto = {
        control_groups: {},
        tables: {},
        files: {}
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
              id: '',
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: ''
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
              id: '',
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: ''
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
              id: '',
              is: el.is_colection,
              options: [...el.options],
              endpoint: el.enpoint_control,
              name_object: ''
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
      this.payload = ''
      this.payload = JSON.parse(JSON.stringify(objeto))
      console.log(this.payload)
    },
    copyPayload: function () {
      if (navigator.clipboard) {
        let mensaje = JSON.stringify(this.payload)

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

/* {
                files: [],
                tables: {
                  info_muestra: {
                    body: [
                      {
                        lote: {
                          value: "asda",
                          collection: {
                            id: 0,
                            is: false,
                            options: [],
                            endpoint: ""
                          }
                        },
                        analisis: {
                          value: "Coliformes totales [UFC] Coliformes fecales [UFC] ",
                          collection: {
                            id: [
                              1,
                              2
                            ],
                            is: true,
                            options: [],
                            endpoint: "/mag_angel/catalogo_analisis"
                          }
                        },
                        num_unidades: {
                          value: "2",
                          collection: {
                            id: 0,
                            is: false,
                            options: [],
                            endpoint: ""
                          }
                        },
                        tipo_muestra: {
                          value: "aaaa",
                          collection: {
                            id: 0,
                            is: false,
                            options: [],
                            endpoint: ""
                          }
                        },
                        vencimiento_lote: {
                          value: "2023-04-27",
                          collection: {
                            id: 0,
                            is: false,
                            options: [],
                            endpoint: ""
                          }
                        }
                      }
                    ],
                    name: "Detalle de muestra de Análisis Microbiológica de Alimentos:",
                    headers: {
                      lote: {
                        label: "Lote",
                        position: 2
                      },
                      analisis: {
                        label: "Tipo análisis",
                        position: 4
                      },
                      num_unidades: {
                        label: "Unidades entregadas",
                        position: 1
                      },
                      tipo_muestra: {
                        label: "Tipo muestra",
                        position: 0
                      },
                      vencimiento_lote: {
                        label: "Fecha vencimiento",
                        position: 3
                      }
                    },
                    controls: {
                      lote: {
                        type: "input",
                        label: "Lote",
                        rules: {
                          type: "string",
                          required: true
                        },
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "Escriba el lote"
                      },
                      analisis: {
                        type: "checkbox",
                        label: "Información de análisis solicitado",
                        rules: {
                          type: "string",
                          required: true
                        },
                        collection: {
                          id: 0,
                          is: true,
                          options: [],
                          endpoint: "/mag_angel/catalogo_analisis"
                        },
                        placeholder: ""
                      },
                      num_unidades: {
                        type: "input",
                        label: "Número de unidades entregadas",
                        rules: {
                          type: "integer",
                          required: true
                        },
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "Escriba un número"
                      },
                      tipo_muestra: {
                        type: "input",
                        label: "Tipo de muestra",
                        rules: {
                          type: "string",
                          required: true
                        },
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "Escriba una descripción"
                      },
                      vencimiento_lote: {
                        type: "input",
                        label: "Fecha de vencimiento del lote",
                        rules: {
                          type: "date",
                          required: true
                        },
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "DD-MM-AAAA"
                      }
                    }
                  }
                },
                control_groups: {
                  default: {
                    type: "group",
                    label: "",
                    controls: {
                      estado_envase: {
                        type: "select",
                        label: "Estado del envase/empaque",
                        rules: {
                          type: "string",
                          required: true
                        },
                        value: "Intacto",
                        collection: {
                          id: 0,
                          is: false,
                          options: [
                            "Intacto",
                            "Abierto",
                            "Dañado"
                          ],
                          endpoint: ""
                        },
                        placeholder: "Seleccione una opción"
                      },
                      observaciones: {
                        type: "textarea",
                        label: "Observaciones",
                        rules: {
                          type: "string",
                          required: false
                        },
                        value: "1",
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "Añada un comentario"
                      },
                      fecha_muestreo: {
                        type: "input",
                        label: "Fecha de muestreo",
                        rules: {
                          type: "date",
                          required: true
                        },
                        value: "2023-04-20",
                        collection: {
                          id: 0,
                          is: false,
                          options: [],
                          endpoint: ""
                        },
                        placeholder: "DD-MM-AAAA"
                      },
                      condicion_ingreso: {
                        type: "select",
                        label: "Condiciones de ingreso",
                        rules: {
                          type: "string",
                          required: true
                        },
                        value: "Temperatura ambiente",
                        collection: {
                          id: 0,
                          is: false,
                          options: [
                            "Temperatura de ambiente",
                            "Refrigerada",
                            "Congelada"
                          ],
                          endpoint: ""
                        },
                        placeholder: "Seleccione una opción"
                      }
                    },
                    collection: {
                      id: 0,
                      is: false,
                      options: [],
                      endpoint: ""
                    }
                  }
                }
              } */