const API =
  "https://script.google.com/macros/s/AKfycbzRwpT0EN4vAezG8qVhKXSaLsjskC_P6wy85xf9gYi89neuv6z7PNrUkyAcIQOCPkTyLA/exec";

function trackerApp() {
  return {
    menu: "dashboard",

    openMenu: false,
    openSholat: false,
    openPuasa: false,
    openModalQodo: false,

    activeTab: "text-green-600 border-b-2 border-green-600",

    sholat: [],
    puasa: [],

    tahunList: [],
    tahunFilter: "",

    hutangSholat: 0,
    hutangPuasa: 0,

    formSholat: {
      tanggal: "",
      nama: "Subuh",
    },

    formPuasa: {
      tanggal: "",
      nama: "",
    },

    formQodo: {
      id: "",
      type: "",
      tanggal_qodo: "",
    },

    init() {
      this.loadData();

      this.$watch("tahunFilter", () => {
        this.hitungStat();
      });
    },

    /* API */

    async apiGet(type) {
      const res = await fetch(`${API}?type=${type}`);
      return res.json();
    },

    async apiPost(data) {
      await fetch(API, {
        method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        body: JSON.stringify(data),
      });
    },

    /* LOAD DATA */

    async loadData() {
      const [sholat, puasa] = await Promise.all([
        this.apiGet("sholat"),
        this.apiGet("puasa"),
      ]);

      console.log("DATA SHOLAT", this.sholat);
      console.log("DATA PUASA", this.puasa);

      this.sholat = sholat;
      this.puasa = puasa;

      this.generateTahun();
      this.hitungStat();
    },

    /* COMPUTED */

    get sholatBelum() {
      return this.sholat.filter(
        (i) =>
          !String(i.tanggal_qodo).trim() &&
          Number(i.tahun) === Number(this.tahunFilter),
      );
    },

    get puasaBelum() {
      return this.puasa.filter(
        (i) =>
          !String(i.tanggal_qodo).trim() &&
          Number(i.tahun) === Number(this.tahunFilter),
      );
    },

    get sholatSudah() {
      return this.sholat.filter(
        (i) => i.tanggal_qodo && i.tahun == this.tahunFilter,
      );
    },

    get puasaSudah() {
      return this.puasa.filter(
        (i) => i.tanggal_qodo && i.tahun == this.tahunFilter,
      );
    },

    /* ACTION */

    async saveSholat() {
      await this.apiPost({
        action: "add",
        type: "sholat",
        tanggal: this.formSholat.tanggal,
        nama: this.formSholat.nama,
      });

      this.formSholat = {
        tanggal: "",
        nama: "Subuh",
      };

      this.openSholat = false;
      this.loadData();
    },

    async savePuasa() {
      await this.apiPost({
        action: "add",
        type: "puasa",
        tanggal: this.formPuasa.tanggal,
        nama: this.formPuasa.nama,
      });

      this.formPuasa = {
        tanggal: "",
        nama: "",
      };

      this.openPuasa = false;
      this.loadData();
    },

    openQodo(item, type) {
      this.formQodo.id = item.id;
      this.formQodo.type = type;

      this.openModalQodo = true;
    },

    async saveQodo() {
      await this.apiPost({
        action: "qodo",
        type: this.formQodo.type,
        id: this.formQodo.id,
        tanggal_qodo: this.formQodo.tanggal_qodo,
      });

      this.openModalQodo = false;
      this.loadData();
    },

    /* UTIL */

    generateTahun() {
      const tahun = [
        ...this.sholat.map((i) => Number(i.tahun)),
        ...this.puasa.map((i) => Number(i.tahun)),
      ].filter((t) => !isNaN(t));

      const list = [...new Set(tahun)].sort((a, b) => b - a);

      this.tahunList = list;

      if (!this.tahunFilter && list.length) {
        this.tahunFilter = list[0];
      }
    },

    hitungStat() {
      this.hutangSholat = this.sholatBelum.length;
      this.hutangPuasa = this.puasaBelum.length;
    },

    formatTanggal(tanggal) {
      const d = new Date(tanggal);

      return d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });
    },
  };
}
