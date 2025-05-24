import { Link } from "react-router-dom";
import Head from "@/Components/Common/Head";
import Button from "@/Components/Common/Button";
import route from "@/Utils/route";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head title="Selamat Datang di Siado Clone" />

      <div className="relative h-screen bg-indigo-800 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Latar belakang edukasi"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-indigo-700 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 mt-48 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            <span className="block">Selamat Datang di</span>
            <span className="block text-indigo-200">Siado Clone</span>
          </h1>
          <p className="mt-6 max-w-lg text-xl text-indigo-200 sm:max-w-3xl">
            Platform komprehensif bagi guru untuk mengelola tugas, memberi
            nilai, dan berinteraksi dengan siswa.
          </p>
          <div className="mt-10 max-w-sm sm:max-w-none sm:flex">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link to={route("teacher.dashboard")}>
                <Button size="lg" className="w-full">
                  Dashboard Dosen
                </Button>
              </Link>
              <Link to={route("login")}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50"
                >
                  Masuk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">
              Fitur
            </h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              Segala yang Anda butuhkan untuk mengajar{" "}
            </p>
            <p className="mt-5 max-w-prose mx-auto text-xl text-gray-500">
              Siado Clone memberikan pengalaman tanpa hambatan bagi guru untuk
              mengelola kursus dan tugas mereka.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Pembuatan Tugas
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Buat tugas mendetail dengan format teks kaya, lampiran,
                      dan tenggat waktu. Organisasikan tugas berdasarkan mata
                      pelajaran dan topik.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Sistem Penilaian
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Nilai tugas siswa dengan rubrik yang dapat disesuaikan.
                      Berikan umpan balik mendalam dan lacak perkembangan siswa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Manajemen Siswa
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Kelola pendaftaran siswa, lacak kehadiran, dan
                      komunikasikan melalui platform.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Dashboard Analitik
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Dapatkan wawasan tentang performa siswa melalui analitik
                      dan laporan. Lacak perkembangan dan identifikasi area yang
                      perlu ditingkatkan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Integrasi Kalender
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Jadwalkan tugas dan tenggat waktu dengan kalender
                      terintegrasi. Atur pengingat dan notifikasi untuk tanggal
                      penting.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg
                          className="h-6 w-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                      Responsif di Perangkat Seluler{" "}
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Akses platform dari perangkat apa pun dengan desain
                      responsif penuh. Nilai tugas dan kelola kursus saat
                      bepergian.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Siap untuk memulai?</span>
            <span className="block">Akses dashboard dosen sekarang.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Bergabunglah dengan ribuan pendidik yang sudah menggunakan Siado
            Clone untuk meningkatkan pengalaman mengajar mereka.
          </p>
          <Link to={route("teacher.dashboard")}>
            <Button
              size="lg"
              className="mt-8 w-full sm:w-auto bg-white text-indigo-700 hover:bg-indigo-50"
            >
              Mulai Sekarang
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
