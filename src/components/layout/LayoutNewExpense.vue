<template>
  <div class="w-100 d-flex justify-content-center">
    <div>
      <button type="button" @click="showModal=true" class="btn btn-lg btn-outline-primary w-75">
        <i class="fa fa-plus"></i>
        Novo Gasto
      </button>
    </div>

    <form @submit.prevent="submit()">
      <!-- Modal -->
      <div
        class="modal fade"
        :class="{show: showModal}"
        :style="{display: showModal ? 'block' : 'none'}"
      >
        <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLongTitle">Adicionar novo gasto</h5>
              <button type="button" class="close" @click="closeModal()" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="form-group col-8">
                  <label for>Descrição:</label>
                  <input type="text" class="form-control" v-model="form.description" required>
                </div>
                <div class="form-group col-4">
                  <label for>Valor (R$):</label>
                  <input type="text" class="form-control" v-model="form.value" required>
                </div>
                <div class="form-group flex-column col-12 align-items-center">
                  <input
                    class="d-none"
                    ref="input"
                    type="file"
                    accept="image/*"
                    @change="handleFile($event)"
                  >
                  <button
                    type="button"
                    @click="openFileDialog()"
                    class="btn btn-outline-secondary"
                  >Adicionar comprovante</button>
                  <div class="mt-2" v-if="form.receipt">
                    {{ form.receipt.name}}
                    <button
                      @click="form.receipt = ''"
                      type="button"
                      class="btn badge badge-light"
                    >
                      <i class="fa fa-trash text-danger"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeModal()">Fechar</button>
              <button class="btn btn-primary">Incluir gasto</button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="modal-backdrop fade"
        :style="{display: showModal ? 'block' : 'none'}"
        :class="{show: showModal}"
      ></div>
    </form>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    form: {
      receipt: '',
      description: '',
      value: ''
    }
  }),
  computed: {
    fileName() {
      const { receipt } = this.form;

      if (receipt) {
        const split = receipt.name.split(".");
        return `${split[0]}-${new Date().getTime()}.${split[1]}`;
      } else {
        return "";
      }
    }
  },
  methods: {
    openFileDialog() {
      this.$refs.input.value = null;
      this.$refs.input.click();
    },
    handleFile({ target }) {
      this.form.receipt = target.files[0];
    },
    async submit() {
      let url = "";

      try {
        this.$root.$emit("Spinner::show");
        const ref = this.$firebase.database().ref(window.uid);
        const id = ref.push().key;

        if (this.form.receipt) {
          const snapshot = await this.$firebase
            .storage()
            .ref(window.uid)
            .child(this.fileName)
            .put(this.form.receipt);

          url = await snapshot.ref.getDownloadURL();
        }

        const payload = {
          id,
          ...this.form,
          receipt: url,
          createdAt: new Date().getTime()
        };

        ref.child(id).set(payload, err => {
          if (err) {
            this.$root.$emit('Notification::show', {
              type: 'danger',
              message: 'Não foi possível inserir o gasto, tente novamente'
            })
          } else {
             this.$root.$emit('Notification::show', {
              type: 'success',
              message: 'Gasto inserido com sucesso!'
            })
            this.closeModal();
          }
        });
      } catch (err) {
         this.$root.$emit('Notification::show', {
              type: danger,
              message: 'Não foi possível inserir o gasto, tente novamente'
            })
      } finally {
        this.$root.$emit("Spinner::hide");
      }
    },
    closeModal() {
      this.showModal = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.modal {
  color: var(--dark);
}
</style>
