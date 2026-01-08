package datasource

import (
	"context"
	"net/http"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apiserver/pkg/registry/rest"

	authlib "github.com/grafana/authlib/types"
	"github.com/grafana/grafana-plugin-sdk-go/backend"
	"github.com/grafana/grafana/pkg/apimachinery/identity"
	"github.com/grafana/grafana/pkg/apimachinery/utils"
	datasourceV0alpha1 "github.com/grafana/grafana/pkg/apis/datasource/v0alpha1"
	"github.com/grafana/grafana/pkg/services/apiserver/endpoints/request"
)

type subAccessREST struct {
	builder      *DataSourceAPIBuilder
	getter       rest.Getter
	accessClient authlib.AccessClient
}

var _ = rest.Connecter(&subAccessREST{})
var _ = rest.StorageMetadata(&subAccessREST{})

func (r *subAccessREST) New() runtime.Object {
	return &datasourceV0alpha1.DatasourceAccessInfo{}
}

func (r *subAccessREST) Destroy() {
}

func (r *subAccessREST) ConnectMethods() []string {
	return []string{"GET"}
}

func (r *subAccessREST) ProducesMIMETypes(verb string) []string {
	return nil
}

func (r *subAccessREST) ProducesObject(verb string) interface{} {
	return &datasourceV0alpha1.DatasourceAccessInfo{
		DatasourcesIdRead: "true",
		DatasourcesRead:   "true",
		DatasourcesWrite:  "true",
		DatasourcesDelete: "true",
		DatasourcesQuery:  "true",
	}
}

func (r *subAccessREST) NewConnectOptions() (runtime.Object, bool, string) {
	return nil, false, "" // true means you can use the trailing path as a variable
}

func (r *subAccessREST) Connect(ctx context.Context, name string, opts runtime.Object, responder rest.Responder) (http.Handler, error) {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		access, err := r.getAccessInfo(ctx, name)
		if err != nil {
			responder.Error(err)
		} else {
			responder.Object(200, access)
		}
	}), nil
}

func (r *subAccessREST) getAccessInfo(ctx context.Context, name string) (*datasourceV0alpha1.DatasourceAccessInfo, error) {
	ns, err := request.NamespaceInfoFrom(ctx, true)
	if err != nil {
		backend.Logger.Warn(err.Error())
		return nil, err
	}
	backend.Logger.Warn(ns.Value)
	user, err := identity.GetRequester(ctx)
	if err != nil {
		backend.Logger.Warn(err.Error())
		return nil, err
	}
	backend.Logger.Warn(user.GetName())

	// Can view is managed here (and in the Authorizer)
	f, err := r.getter.Get(ctx, name, &v1.GetOptions{})
	if err != nil {
		return nil, err
	}
	obj, err := utils.MetaAccessor(f)
	if err != nil {
		return nil, err
	}
	var tmp authlib.CheckResponse
	check := func(verb string) string {
		tmp, err = r.accessClient.Check(ctx, user, authlib.CheckRequest{
			Verb:      verb,
			Group:     datasourceV0alpha1.DataSourceResourceInfo.GroupVersion().Group,
			Resource:  datasourceV0alpha1.DataSourceResourceInfo.GroupResource().Resource,
			Namespace: ns.Value,
			Name:      name,
		}, obj.GetFolder())
		if tmp.Allowed {
			return "true"
		} else {
			return "false"
		}
	}

	rsp := &datasourceV0alpha1.DatasourceAccessInfo{}
	rsp.DatasourcesIdRead = check(utils.VerbGet)
	rsp.DatasourcesRead = check(utils.VerbGet)
	rsp.DatasourcesWrite = check(utils.VerbUpdate)
	rsp.DatasourcesDelete = check(utils.VerbDelete)
	return rsp, nil
}
