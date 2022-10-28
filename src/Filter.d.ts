export interface Filter {
  exclude?: number | ((key) => boolean)
  include?: number | ((key) => boolean)
}
