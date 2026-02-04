import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RichTextEditor from "@/components/common/RichTextEditor";
import { Edit, Trash2 } from "lucide-react";
import { confirmAlert, successAlert } from "@/lib/alert";
import { renderHtml } from "@/utils/text";

/* =========================
   API SERVICE
========================= */
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/categoryApi";

export default function Categories() {
  /* =========================
     STATE DATA
  ========================= */
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(6);
  const [search, setSearch] = useState("");

  const [meta, setMeta] = useState({
    page: 1,
    perPage: 6,
    totalItems: 0,
    totalPages: 1,
  });

  /* =========================
     STATE FORM
  ========================= */
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [keywords, setKeywords] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [errors, setErrors] = useState({});

  /* =========================
     FETCH DATA (SERVER SIDE)
  ========================= */
  useEffect(() => {
    fetchCategories();
  }, [page, perPage, search]);

  async function fetchCategories() {
    try {
      setLoading(true);

      const res = await getCategories({
        page,
        perPage,
        search,
      });

      const mediaBase = res.data.media;

      setData(
        res.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          description: renderHtml(item.description),
          keywords: item.keywords,
          users: item.users?.full_name,
          image: item.image
            ? `${mediaBase}${item.image.replace(/^\/+/, "")}`
            : "",
        }))
      );

      setMeta(res.data.meta);
    } catch (err) {
      console.error("Fetch kategori error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* =========================
     FORM HANDLER
  ========================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setName(row.name);
    setDesc(row.description);
    setKeywords(row.keywords || "");
    setImgPreview(row.image);
    setImgFile(null);
    setOpen(true);
  };

  async function handleDelete(row) {
    const res = await confirmAlert({
      title: "Hapus kategori?",
      text: `Kategori "${row.name}" akan dihapus permanen.`,
      confirmText: "Ya, Hapus",
      cancelText: "Batal",
    });

    if (!res.isConfirmed) return;

    try {
      await deleteCategory(row.id);
      await successAlert("Berhasil", "Kategori berhasil dihapus.");
      setPage(1);
      fetchCategories();
    } catch (err) {
      console.error("Delete kategori error:", err);
    }
  }

  const closeDialog = () => {
    setOpen(false);
    setEditingId(null);
    setName("");
    setDesc("");
    setKeywords("");
    setImgFile(null);
    setImgPreview("");
    setErrors({});
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nama kategori wajib diisi.";
    if (!desc.trim()) newErrors.desc = "Deskripsi wajib diisi.";
    if (!keywords.trim()) newErrors.keywords = "Keywords wajib diisi.";
    if (!editingId && !imgFile)
      newErrors.img = "Gambar wajib diisi.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", desc);
    formData.append("keywords", keywords);
    if (imgFile) formData.append("image", imgFile);

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
        await successAlert("Berhasil", "Kategori berhasil diubah.");
      } else {
        await createCategory(formData);
        await successAlert("Berhasil", "Kategori berhasil ditambahkan.");
      }

      closeDialog();
      fetchCategories();
    } catch (err) {
      console.error("Submit kategori error:", err);
    }
  }

  /* =========================
     RENDER
  ========================= */
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Kategori</h2>
        <Button onClick={() => setOpen(true)}>+ Add Kategori</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search & PerPage */}
        <div className="flex justify-between mb-4">
          <div className="flex items-center gap-2 w-full sm:w-1/2">
            <Input
              placeholder="Search kategori..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-10"
            />
          </div>

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={2}>2 / page</option>
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>

        {/* Info */}
        <div className="text-sm text-slate-600 mb-2">
          Showing{" "}
          <strong>
            {(meta.page - 1) * meta.perPage + 1}
          </strong>{" "}
          –{" "}
          <strong>
            {Math.min(meta.page * meta.perPage, meta.totalItems)}
          </strong>{" "}
          of <strong>{meta.totalItems}</strong>
        </div>

        {/* Table */}
        <table className="w-full text-sm divide-y">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Gambar</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Deskripsi</th>
              <th className="px-3 py-2">Keywords</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Data kosong
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50">
                  <td className="px-3 py-3 font-semibold">
                    {(meta.page - 1) * meta.perPage + idx + 1}.
                  </td>
                  <td className="px-3 py-3">
                    {row.image ? (
                      <img
                        src={row.image}
                        alt={row.name}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">
                        No Image
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-medium capitalize">
                    {row.name}
                  </td>
                  <td
                    className="px-3 py-3 prose prose-sm max-w-none
             prose-ol:list-decimal
             prose-ul:list-disc
             prose-li:ml-4"
                    dangerouslySetInnerHTML={{ __html: row.description }}
                  />

                  <td className="px-3 py-3">{row.keywords}</td>
                  <td className="px-3 py-3 capitalize">{row.users}</td>
                  <td className="px-3 py-3 text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(row)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(row)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex justify-end mt-4 gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </Button>

            {Array.from(
              { length: meta.totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                size="sm"
                variant={p === meta.page ? "default" : "outline"}
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ))}

            <Button
              size="sm"
              variant="outline"
              disabled={meta.page === meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              ›
            </Button>
          </div>
        )}
      </div>

      {/* MODAL */}
      <Dialog open={open} onOpenChange={(v) => !v && closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Kategori" : "Add Kategori"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nama kategori"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <RichTextEditor value={desc} onChange={setDesc} />

            <Input
              placeholder="musik, konser, tiket"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />

            <Input type="file" accept="image/*" onChange={handleImageChange} />

            {imgPreview && (
              <img
                src={imgPreview}
                alt="preview"
                className="h-32 object-contain"
              />
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  );
}
