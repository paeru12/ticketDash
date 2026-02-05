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
import { confirmAlert, successAlert, errorAlert } from "@/lib/alert";
import { renderHtml } from "@/utils/text";

/* ========== API SERVICE ========== */
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "@/lib/bannerApi";

export default function BannerPage() {
  /* LIST STATE */
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

  /* FORM STATE */
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [isActive, setIsActive] = useState("true");

  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const [errors, setErrors] = useState({});

  /* FETCH DATA */
  useEffect(() => {
    fetchData();
  }, [page, perPage, search]);

  async function fetchData() {
    try {
      setLoading(true);

      const res = await getBanners({ page, perPage, search });
      const mediaBase = res.data.media;

      setData(
        res.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          link: item.link,
          isActive: item.is_active,
          author: item.author?.full_name,
          image: item.image_banner
            ? `${mediaBase}${item.image_banner.replace(/^\/+/, "")}`
            : "",
        }))
      );

      setMeta(res.data.meta);
    } catch (err) {
      console.error("Fetch banner error:", err);
    } finally {
      setLoading(false);
    }
  }

  /* IMAGE HANDLER */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      setImgPreview(URL.createObjectURL(file));
    }
  };

  /* EDIT */
  const handleEdit = (row) => {
    setEditingId(row.id);
    setName(row.name);
    setLink(row.link || "");
    setIsActive(row.isActive ? "true" : "false");
    setImgPreview(row.image);
    setImgFile(null);
    setOpen(true);
  };

  /* DELETE */
  async function handleDelete(row) {
    const res = await confirmAlert({
      title: "Hapus Banner?",
      text: `Banner "${row.name}" akan dihapus permanen.`,
      confirmText: "Hapus",
    });

    if (!res.isConfirmed) return;

    try {
      await deleteBanner(row.id);
      await successAlert("Berhasil", "Banner berhasil dihapus.");
      fetchData();
    } catch (err) {
      errorAlert("Gagal", err.response?.data?.message || err.message);
    }
  }

  /* RESET FORM */
  const closeDialog = () => {
    setOpen(false);
    setEditingId(null);
    setName("");
    setLink("");
    setIsActive("true");
    setImgFile(null);
    setImgPreview("");
    setErrors({});
  };

  /* SUBMIT */
  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};
    if (!name.trim()) newErrors.name = "Nama banner wajib diisi.";
    if (!editingId && !imgFile) newErrors.image = "Gambar wajib diisi.";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    formData.append("is_active", isActive === "true");
    if (imgFile) formData.append("image_banner", imgFile);

    try {
      if (editingId) {
        await updateBanner(editingId, formData);
        await successAlert("Berhasil", "Banner berhasil diperbarui.");
      } else {
        await createBanner(formData);
        await successAlert("Berhasil", "Banner berhasil ditambahkan.");
      }

      closeDialog();
      fetchData();
    } catch (err) {
      errorAlert("Gagal", err.response?.data?.message || err.message);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Banner</h2>
        <Button onClick={() => setOpen(true)}>+ Add Banner</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {/* Search */}
        <div className="flex justify-between mb-4">
          <Input
            placeholder="Search banner..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
          />

          <select
            value={perPage}
            onChange={(e) => {
              setPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={6}>6 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
          </select>
        </div>

        {/* Table */}
        <table className="w-full text-sm divide-y">
          <thead>
            <tr className="text-left text-xs text-slate-500">
              <th className="px-3 py-2">No</th>
              <th className="px-3 py-2">Gambar</th>
              <th className="px-3 py-2">Nama</th>
              <th className="px-3 py-2">Link</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-6 text-center">
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
                        className="h-12 w-20 object-cover rounded"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No Image</span>
                    )}
                  </td>

                  <td className="px-3 py-3 font-medium capitalize">
                    {row.name}
                  </td>

                  <td className="px-3 py-3">{row.link || "-"}</td>

                  <td className="px-3 py-3">
                    {row.isActive ? (
                      <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded bg-red-100 text-red-700">
                        Inactive
                      </span>
                    )}
                  </td>

                  <td className="px-3 py-3 capitalize">{row.author}</td>

                  <td className="px-3 py-3 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(row)}
                      className="text-blue-600"
                    >
                      <Edit size={16} />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
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
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ‹
            </Button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  onClick={() => setPage(p)}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              size="sm"
              variant="outline"
              disabled={page === meta.totalPages}
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
              {editingId ? "Edit Banner" : "Tambah Banner"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Nama banner"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}

            <Input
              placeholder="Link (opsional)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <div className={editingId ? "flex gap-4" : "hidden"}>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="true"
                  checked={isActive === "true"}
                  onChange={(e) => setIsActive(e.target.value)}
                />
                <span>Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="false"
                  checked={isActive === "false"}
                  onChange={(e) => setIsActive(e.target.value)}
                />
                <span>Inactive</span>
              </label>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-slate-700">Gambar Banner *</label>
              <label
                className={`flex flex-col items-center justify-center h-full min-h-[250px] border-2 border-dashed rounded-xl cursor-pointer transition-all 
                ${errors.image ? 'border-red-500 bg-red-50' : 'border-slate-300 hover:bg-slate-50'}`}
              >
                {imgPreview ? (
                  <div className="relative w-1/2 h-1/2 p-2">
                    <img src={imgPreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 bg-black/20 transition-opacity rounded-lg">
                      <p className="text-white text-xs font-semibold bg-black/50 px-2 py-1 rounded">Ganti Banner</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <div className="mx-auto w-12 h-12 mb-3 text-slate-400 bg-slate-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-500">Klik untuk upload banner</p>
                    <p className="text-xs text-slate-400 mt-1">Format: JPG, PNG (Maks 2MB)</p>
                  </div>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
              {errors.image && <p className="text-xs text-red-500">{errors.image}</p>}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Batal
              </Button>

              <Button type="submit">
                {editingId ? "Update" : "Simpan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
