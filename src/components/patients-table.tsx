import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import {
  Ban,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Plus,
  UserPen,
  UserPlus,
  UsersRound,
} from 'lucide-react'
import { cpfMask, rgMask } from 'masks-br'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { deletePatient } from '@/api/delete-patient'
import { type PatientProps } from '@/api/get-user'
import { registerPatient } from '@/api/register-patient'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { queryClient } from '@/lib/react-query'
import { axiosErrorHandler } from '@/utils/axiosErrorHandler'

const newPatientForm = z.object({
  name: z.string().min(3, { message: 'Digite o nome completo.' }),
  age: z.coerce
    .number()
    .int()
    .min(1, { message: 'Informe a idade do paciente.' })
    .max(99),
  document: z.string().refine(
    (doc) => {
      const cleanedDoc = doc.replace(/\D/g, '')

      const cpfRegex = /^\d{11}$/
      const rgRegex = /^\d{9}$/

      return cpfRegex.test(cleanedDoc) || rgRegex.test(cleanedDoc)
    },
    {
      message: 'Documento deve ser um CPF ou RG válido.',
    },
  ),
  phone: z
    .string()
    .optional()
    .refine(
      (phone) => {
        if (!phone) return true

        const cleanedPhone = phone.replace(/\D/g, '')
        return cleanedPhone.length === 11
      },
      {
        message: 'Telefone deve ser um número de celular válido.',
      },
    ),
})

type NewPatientForm = z.infer<typeof newPatientForm>

export function PatientTable({ data }: { data: PatientProps[] }) {
  const { toast } = useToast()

  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<PatientProps>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => (
        <div className="w-56">
          <Label>{row.getValue('name')}</Label>
        </div>
      ),
    },
    // {
    //   accessorKey: 'age',
    //   header: 'Idade',
    //   cell: ({ row }) => <Label>{row.getValue('age')} anos</Label>,
    // },
    {
      accessorKey: 'document',
      header: 'Documento',
      cell: ({ row }) => {
        const document = String(row.getValue('document'))

        return (
          <Label>
            {document.length === 9
              ? `RG: ${rgMask(document)}`
              : `CPF: ${cpfMask(document)}`}
          </Label>
        )
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const patient = row.original

        return (
          <div className="w-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-8 p-0">
                  <span className="sr-only">Abrir menu</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                {/* <DropdownMenuItem className="gap-2" onClick={() => null}>
                  <UserPen className="size-4 text-primary" />
                  Editar
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => handleDeletePatient(patient.id)}
                >
                  <Ban className="size-4 text-rose-500" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewPatientForm>({
    resolver: zodResolver(newPatientForm),
  })

  const { mutateAsync: registerPatientFn } = useMutation({
    mutationFn: registerPatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  const { mutateAsync: deletePatientFn } = useMutation({
    mutationFn: deletePatient,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  async function handleCreateNewPatient(data: NewPatientForm) {
    try {
      await registerPatientFn({
        name: data.name,
        age: data.age,
        document: data.document,
        phone: data.phone,
      })

      reset()
      setIsPopoverOpen(false)

      toast({
        variant: 'default',
        title: 'Pacientes',
        description: 'Paciente cadastrado!',
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      toast({
        variant: 'destructive',
        title: 'Pacientes',
        description: errorMessage,
      })
    }
  }

  async function handleDeletePatient(id: string) {
    try {
      await deletePatientFn({ id })

      toast({
        variant: 'default',
        title: 'Pacientes',
        description: 'Paciente excluído',
      })
    } catch (error) {
      const errorMessage = axiosErrorHandler(error)

      toast({
        variant: 'destructive',
        title: 'Pacientes',
        description: errorMessage,
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-3">
          <UsersRound className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold tracking-tight">Pacientes</h1>
        </div>

        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal md:px-8 lg:px-12"
                onClick={() => setIsPopoverOpen(true)}
              >
                <UserPlus className="mr-2 size-4 text-primary" />
                Cadastrar novo
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <form
              className="items-center space-y-2"
              onSubmit={handleSubmit(handleCreateNewPatient)}
            >
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  className="mt-1"
                  maxLength={50}
                  placeholder="Nome completo"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input
                  className="mt-1"
                  maxLength={2}
                  placeholder="Idade do paciente"
                  {...register('age')}
                />
              </div>
              {errors.age && (
                <p className="text-sm text-red-500">{errors.age.message}</p>
              )}
              <div>
                <Label htmlFor="document">Documento</Label>
                <Input
                  className="mt-1"
                  maxLength={11}
                  placeholder="CPF ou RG"
                  {...register('document')}
                />
              </div>
              {errors.document && (
                <p className="text-sm text-red-500">
                  {errors.document.message}
                </p>
              )}
              <div>
                <Label htmlFor="document">Telefone (WhatsApp)</Label>
                <Input
                  className="mt-1"
                  maxLength={11}
                  placeholder="Com DDD"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="default"
                  className="w-full gap-2"
                >
                  <Plus className="size-4" />
                  Cadastrar
                </Button>
              </div>
            </form>
          </PopoverContent>
        </Popover>
      </div>
      <p className="text-sm text-muted-foreground">
        Consulte os dados de seus pacientes
      </p>

      <div>
        <div className="w-full">
          <div className="flex items-center justify-between py-4">
            <Input
              placeholder="Pesquise aqui..."
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('name')?.setFilterValue(event.target.value)
              }
              className="mr-4 max-w-lg"
            />
            <div className="inline-flex gap-2 text-sm font-medium text-muted-foreground sm:text-base">
              Registros
              <span className="items-center rounded-sm bg-primary px-3 text-white">
                {table.getFilteredRowModel().rows.length}
              </span>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between py-4">
            <Label className="text-muted-foreground">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount() > 0 ? table.getPageCount() : 1}
            </Label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
