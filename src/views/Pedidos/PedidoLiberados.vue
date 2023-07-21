<template>
  <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh">
    <h2 class="title">Pedidos Liberados</h2>

    <div v-if="pedidos.length > 0">
      <div class="table-responsive">
        <table class="table table-striped table-bordered" ref="dataTable">
          <thead class="table-dark">
            <tr>
              <th>PEDIDO #</th>
              <th>MESA</th>
              <th>ESTADO PEDIDO</th>
              <th>TOTAL PAGAR</th>
              <th>FECHA PEDIDO</th>
              <th>PRODUCTOS</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pedido in pedidos" :key="pedido.id">
              <td>{{ pedido.id }}</td>
              <td>{{ pedido.mesa ? pedido.mesa.nombre : '-' }}</td>
              <td>{{ pedido.estado }}</td>
              <td>{{ pedido.total | formatCurrency }}</td>
              <td>{{ formatDate(pedido.created_at) }}</td>
              <td>
                <ul>
                  <li v-for="producto in pedido.productos" :key="producto.id">
                    {{ producto.nombre }} (Cantidad: {{ producto.pivot.cantidad }})
                  </li>
                </ul>
              </td>
              <td>
                <button class="btn btn-primary" @click="generarPago(pedido.id)">
                  Generar pago
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-else class="empty-message">No hay pedidos disponibles para generar pago.</div>
  </div>
</template>

<script>
import axios from 'axios'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      pedidos: []
    }
  },
  mounted() {
    this.getPedidos()
  },
  methods: {
    getPedidos() {
      const token = localStorage.getItem('token')

      axios
        .get('http://127.0.0.1:8000/api/v1/pedidos-liberados', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          this.pedidos = response.data
          this.initDataTable()
        })
        .catch((error) => {
          console.error(error)
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ocurrió un error al obtener los pedidos.'
          })
        })
    },
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    },
    generarPago(pedidoId) {
      const token = localStorage.getItem('token')
      const apiUrl = 'https://pedidos.test/api/v1/generarpago'

      const data = {
        pedidoId: pedidoId,
        monto: 10000
      }

      Swal.fire({
        title: 'Confirmar pago',
        text: '¿Estás seguro de que deseas generar el pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(apiUrl, data, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            .then((response) => {
              const message = response.data.message
              console.log('Pago generado:', message)
              Swal.fire({
                icon: 'success',
                title: 'Pago generado',
                text: 'El pago se ha generado correctamente.'
              })
              // Actualizar la página
              window.location.reload()
            })
            .catch((error) => {
              console.error('Error al generar el pago:', error)
              let errorMessage = 'Ocurrió un error al generar el pago.'
              if (error.response && error.response.data && error.response.data.error) {
                errorMessage = error.response.data.error
              } else if (error.response && error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message
              }
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
              })
            })
        }
      })
    },
    initDataTable() {
      if (this.$refs.dataTable) {
        this.dataTable = new DataTable(this.$refs.dataTable, {
          // Configuración de DataTables
        })
      }
    }
  },
  beforeDestroy() {
    if (this.dataTable) {
      this.dataTable.destroy()
    }
  },
  filters: {
    formatCurrency(value) {
      const formatter = new Intl.NumberFormat('es', {
        style: 'currency',
        currency: 'USD'
      })
      return formatter.format(value)
    }
  }
}
</script>

<style scoped>
.container-fluid {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-image: url('https://img.freepik.com/fotos-premium/patron-marmol-natural-fondo_1258-22162.jpg');
  background-repeat: repeat;
  background-size: cover;
  background-position: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding-bottom: 20px;
}

.title {
  font-size: 56px;
  font-weight: bold;
  color: white;
  border-radius: 30px;
  margin-bottom: 20px;
  animation: slideInUp 1s ease;
  -webkit-text-stroke: 2px orangered;
  color: white;
  text-align: center;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #dee2e6;
}

.table th {
  background-color: #343a40;
  color: white;
}

.table tbody tr:hover {
  background-color: #f8f9fa;
}

.table tbody td table {
  width: 100%;
}

.table tbody td table td {
  border: none;
}

.btn {
  margin-right: 10px;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 14px;
  background-color: #007bff;
  color: white;
}

.btn:hover {
  background-color: #0056b3;
}

.empty-message {
  margin-top: 30px;
  text-align: center;
  font-size: 18px;
  color: #777;
  animation: fade-in 1s ease-in-out;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
