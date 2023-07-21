<template>
      <div class="container-fluid vh-100" style="overflow-y: auto; max-height: 100vh;">
      <h2 class="title">PAGOS GENERADOS</h2>
  
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
              </tr>
            </thead>
            <tbody>
              <tr v-for="pedido in pedidos" :key="pedido.id">
                <td>{{ pedido.id }}</td>
                <td>{{ pedido.mesa ? pedido.mesa.nombre : '-' }}</td>
                <td class="pagoestado">{{ pedido.estado }}</td>
                <td>{{ pedido.total | formatCurrency }}</td>
                <td>{{ formatDate(pedido.created_at) }}</td>
                <td>
                  <ul>
                    <li v-for="producto in pedido.productos" :key="producto.id">
                      {{ producto.nombre }} (Cantidad: {{ producto.pivot.cantidad }})
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        No hay pedidos disponibles.
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        pedidos: []
      };
    },
    mounted() {
      this.getPedidos();
    },
    methods: {
      getPedidos() {
        const token = localStorage.getItem('token');
  
        axios
          .get('http://localhost:8000/api/v1/pagos/lista', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          .then(response => {
            this.pedidos = response.data;
            this.initDataTable();
          })
          .catch(error => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al obtener los pedidos.',
            });
          });
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      },
  
      initDataTable() {
        if (this.$refs.dataTable) {
          this.dataTable = new DataTable(this.$refs.dataTable, {
            // Configuración de DataTables
          });
        }
      }
    },
    beforeDestroy() {
      if (this.dataTable) {
        this.dataTable.destroy();
      }
    },
    filters: {
      formatCurrency(value) {
        const formatter = new Intl.NumberFormat('es', {
          style: 'currency',
          currency: 'USD'
        });
        return formatter.format(value);
      }
    }
  };
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
  
  .pagoestado {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 150px;
    height: 40px;
    border-radius: 50px;
    background-color: green;
    color: white;
    font-size: 14px;
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
  </style>
  