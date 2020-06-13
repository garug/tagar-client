<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class HomePage extends Vue {
  isLoading = false;

  toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}
</script>